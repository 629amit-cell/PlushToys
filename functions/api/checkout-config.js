import { getShippingFeeInr } from "../_lib/catalog.js";
import { json, methodNotAllowed } from "../_lib/http.js";
import { publicKeyId } from "../_lib/razorpay.js";

export async function onRequestGet({ env }) {
  return json({
    currency: "INR",
    shippingFeeInr: getShippingFeeInr(env),
    paymentsEnabled: Boolean(publicKeyId(env) && String(env.RAZORPAY_KEY_SECRET || "").trim()),
  });
}

export function onRequest() {
  return methodNotAllowed("GET");
}
