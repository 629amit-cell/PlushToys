import { getCheckoutSummary } from "../_lib/catalog.js";
import { validateCustomer } from "../_lib/customer.js";
import {
  assertSameOrigin,
  errorResponse,
  HttpError,
  json,
  methodNotAllowed,
  readJson,
} from "../_lib/http.js";
import { savePendingOrder } from "../_lib/orders.js";
import { createRazorpayOrder, publicKeyId } from "../_lib/razorpay.js";

function randomToken(length, alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789") {
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
}

function createOrderNumber() {
  const now = new Date();
  const date = [
    String(now.getUTCFullYear()).slice(-2),
    String(now.getUTCMonth() + 1).padStart(2, "0"),
    String(now.getUTCDate()).padStart(2, "0"),
  ].join("");
  return `PS-${date}-${randomToken(4)}`;
}

export async function onRequestPost({ request, env }) {
  try {
    assertSameOrigin(request);

    const keyId = publicKeyId(env);
    if (!keyId) {
      throw new HttpError(503, "Secure payment is not configured yet.");
    }

    const body = await readJson(request);
    const customer = validateCustomer(body.customer);
    const summary = getCheckoutSummary(body.items, env);

    const orderNumber = createOrderNumber();
    const receipt = `ps_${Date.now()}_${randomToken(6, "abcdefghijkmnopqrstuvwxyz23456789")}`;
    const notes = {
      order_number: orderNumber,
      customer_name: customer.name.slice(0, 140),
      customer_email: customer.email.slice(0, 140),
      customer_phone: customer.phone,
      shipping_address: customer.fullAddress.slice(0, 250),
      cart_summary: summary.lines
        .map((line) => `${line.quantity} x ${line.name} (${line.size})`)
        .join("; ")
        .slice(0, 250),
    };

    const razorpayOrder = await createRazorpayOrder(env, {
      amount: summary.amountPaise,
      currency: summary.currency,
      receipt,
      notes,
    });

    try {
      await savePendingOrder(env, {
        id: crypto.randomUUID(),
        orderNumber,
        razorpayOrderId: razorpayOrder.id,
        receipt,
        amount: summary.amountPaise,
        currency: summary.currency,
        customer,
        itemsJson: JSON.stringify(summary.lines),
        createdAt: new Date().toISOString(),
      });
    } catch {
      throw new HttpError(503, "We couldn't save your order. Please try again.");
    }

    return json({
      orderNumber,
      orderId: razorpayOrder.id,
      keyId,
      amount: razorpayOrder.amount ?? summary.amountPaise,
      currency: razorpayOrder.currency ?? summary.currency,
      subtotal: summary.subtotal,
      shippingFee: summary.shippingFee,
      total: summary.total,
    });
  } catch (error) {
    return errorResponse(error);
  }
}

export function onRequest() {
  return methodNotAllowed("POST");
}
