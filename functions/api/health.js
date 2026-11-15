import { isOrderEmailConfigured } from "../_lib/email.js";
import { json, methodNotAllowed } from "../_lib/http.js";
import { publicKeyId } from "../_lib/razorpay.js";

export function onRequestGet({ env }) {
  return json({
    ok: true,
    paymentsConfigured: Boolean(publicKeyId(env) && String(env.RAZORPAY_KEY_SECRET || "").trim()),
    ordersDatabase: Boolean(env.ORDERS_DB),
    confirmationEmailConfigured: isOrderEmailConfigured(env),
  });
}

export function onRequest() {
  return methodNotAllowed("GET");
}
