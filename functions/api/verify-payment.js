import {
  assertSameOrigin,
  errorResponse,
  HttpError,
  json,
  methodNotAllowed,
  readJson,
} from "../_lib/http.js";
import { markOrderPaid } from "../_lib/orders.js";
import { getRazorpayOrder, getRazorpayPayment } from "../_lib/razorpay.js";
import { verifyHmacSha256Hex } from "../_lib/security.js";

export async function onRequestPost({ request, env }) {
  try {
    assertSameOrigin(request);

    const body = await readJson(request);
    const orderId = String(body.razorpay_order_id || "").trim();
    const paymentId = String(body.razorpay_payment_id || "").trim();
    const signature = String(body.razorpay_signature || "").trim();

    if (!orderId.startsWith("order_") || !paymentId.startsWith("pay_") || !signature) {
      throw new HttpError(400, "The payment details are incomplete.");
    }

    const secret = String(env.RAZORPAY_KEY_SECRET || "").trim();
    if (!secret) {
      throw new HttpError(503, "Secure payment is not configured yet.");
    }

    const signatureValid = await verifyHmacSha256Hex(
      secret,
      `${orderId}|${paymentId}`,
      signature,
    );
    if (!signatureValid) {
      throw new HttpError(400, "The payment signature could not be verified.");
    }

    const [payment, order] = await Promise.all([
      getRazorpayPayment(env, paymentId),
      getRazorpayOrder(env, orderId),
    ]);

    if (payment.order_id !== orderId) {
      throw new HttpError(400, "This payment does not belong to the order.");
    }
    if (!["authorized", "captured"].includes(payment.status)) {
      throw new HttpError(400, "The payment has not been completed.");
    }
    if (payment.amount !== order.amount || payment.currency !== order.currency) {
      throw new HttpError(400, "The payment amount does not match the order.");
    }

    try {
      await markOrderPaid(env, { razorpayOrderId: orderId, paymentId });
    } catch (error) {
      console.error("The payment was verified but could not be marked as paid.", error);
    }

    return json({
      verified: true,
      orderNumber: order.notes?.order_number || orderId,
      orderId,
      paymentId,
      status: payment.status,
      amount: payment.amount,
      currency: payment.currency,
      total: payment.amount / 100,
    });
  } catch (error) {
    return errorResponse(error);
  }
}

export function onRequest() {
  return methodNotAllowed("POST");
}
