import { errorResponse, HttpError, json, methodNotAllowed } from "../_lib/http.js";
import { markOrderPaid } from "../_lib/orders.js";
import { verifyHmacSha256Hex } from "../_lib/security.js";

export async function onRequestPost({ request, env }) {
  try {
    const secret = String(env.RAZORPAY_WEBHOOK_SECRET || "").trim();
    if (!secret) {
      throw new HttpError(503, "The Razorpay webhook is not configured.");
    }

    const signature = request.headers.get("x-razorpay-signature") || "";
    const rawBody = await request.text();
    if (!rawBody) {
      throw new HttpError(400, "The webhook payload is empty.");
    }
    if (rawBody.length > 200000) {
      throw new HttpError(413, "The webhook payload is too large.");
    }

    const signatureValid = await verifyHmacSha256Hex(secret, rawBody, signature);
    if (!signatureValid) {
      throw new HttpError(400, "The webhook signature could not be verified.");
    }

    let event;
    try {
      event = JSON.parse(rawBody);
    } catch {
      throw new HttpError(400, "The webhook payload is not valid JSON.");
    }

    const type = String(event.event || "");
    if (type === "payment.captured" || type === "order.paid") {
      const payment = event.payload?.payment?.entity;
      const order = event.payload?.order?.entity;
      const orderId = String(payment?.order_id || order?.id || "");
      const paymentId = String(payment?.id || "");

      if (orderId && paymentId) {
        try {
          await markOrderPaid(env, { razorpayOrderId: orderId, paymentId });
        } catch (error) {
          console.error("The webhook could not mark the order as paid.", error);
          throw new HttpError(500, "The webhook could not be recorded.");
        }
      }
    }

    return json({ received: true, event: type });
  } catch (error) {
    return errorResponse(error);
  }
}

export function onRequest() {
  return methodNotAllowed("POST");
}
