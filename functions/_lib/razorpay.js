import { HttpError } from "./http.js";

const API_BASE = "https://api.razorpay.com/v1";

function credentials(env = {}) {
  const keyId = String(env.RAZORPAY_KEY_ID || "").trim();
  const keySecret = String(env.RAZORPAY_KEY_SECRET || "").trim();
  if (!keyId || !keySecret) {
    throw new HttpError(503, "Secure payment is not configured yet.");
  }
  return { keyId, keySecret };
}

export function publicKeyId(env = {}) {
  return String(env.RAZORPAY_KEY_ID || "").trim();
}

async function razorpayRequest(env, path, options = {}) {
  const { keyId, keySecret } = credentials(env);
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Basic ${btoa(`${keyId}:${keySecret}`)}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    console.error("Razorpay API error", {
      status: response.status,
      code: data?.error?.code,
      description: data?.error?.description,
    });
    throw new HttpError(
      response.status >= 500 ? 502 : 400,
      "We couldn't complete the payment request. Please try again.",
    );
  }

  return data;
}

export function createRazorpayOrder(env, payload) {
  return razorpayRequest(env, "/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getRazorpayOrder(env, orderId) {
  return razorpayRequest(env, `/orders/${encodeURIComponent(orderId)}`);
}

export function getRazorpayPayment(env, paymentId) {
  return razorpayRequest(env, `/payments/${encodeURIComponent(paymentId)}`);
}
