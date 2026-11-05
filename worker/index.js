import { onRequest as applyApiHeaders } from "../functions/api/_middleware.js";
import * as checkoutConfig from "../functions/api/checkout-config.js";
import * as createOrder from "../functions/api/create-order.js";
import * as health from "../functions/api/health.js";
import * as razorpayWebhook from "../functions/api/razorpay-webhook.js";
import * as verifyPayment from "../functions/api/verify-payment.js";

const apiRoutes = new Map([
  ["/api/health", health],
  ["/api/checkout-config", checkoutConfig],
  ["/api/create-order", createOrder],
  ["/api/verify-payment", verifyPayment],
  ["/api/razorpay-webhook", razorpayWebhook],
]);

function notFound() {
  return new Response(JSON.stringify({ error: "Not found." }), {
    status: 404,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

function handlerFor(routeModule, method) {
  if (method === "GET" && routeModule.onRequestGet) return routeModule.onRequestGet;
  if (method === "POST" && routeModule.onRequestPost) return routeModule.onRequestPost;
  return routeModule.onRequest;
}

export default {
  async fetch(request, env, ctx) {
    const { pathname } = new URL(request.url);
    const routeModule = apiRoutes.get(pathname);

    if (!routeModule) {
      if (!pathname.startsWith("/api")) {
        return env.ASSETS ? env.ASSETS.fetch(request) : notFound();
      }
      return applyApiHeaders({
        request,
        env,
        params: {},
        waitUntil: (promise) => ctx.waitUntil(promise),
        next: async () => notFound(),
      });
    }

    const handler = handlerFor(routeModule, request.method);
    const context = {
      request,
      env,
      params: {},
      waitUntil: (promise) => ctx.waitUntil(promise),
      next: async () => handler(context),
    };

    return applyApiHeaders(context);
  },
};
