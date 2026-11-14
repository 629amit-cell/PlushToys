import { onRequest as applyApiHeaders } from "../functions/api/_middleware.js";
import { CATALOG } from "../functions/_lib/catalog-data.js";
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

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}

function siteOrigin(url) {
  if (url.hostname === "localhost" || url.hostname === "127.0.0.1") return url.origin;
  return "https://plushstory.shop";
}

async function renderProductPage(request, env, url, product) {
  const assetUrl = new URL("/product", url);
  const response = await env.ASSETS.fetch(new Request(assetUrl, request));
  if (!response.ok) return response;

  const origin = siteOrigin(url);
  const pageUrl = `${origin}/product?id=${encodeURIComponent(product.id)}`;
  const title = `${product.name} — Plush Story`;
  const description = `${product.description} Free delivery across India, with secure Razorpay checkout.`;
  const image = `${origin}/assets/og/products/${encodeURIComponent(product.id)}.jpg?v=1`;
  const alt = `${product.name} from Plush Story`;
  const primaryImage = product.primaryImage ? `/${product.primaryImage}?v=1` : "";
  const prices = Object.values(product.prices);
  const structuredData = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: [image],
    sku: product.id,
    brand: { "@type": "Brand", name: "Plush Story" },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "INR",
      lowPrice: Math.min(...prices),
      highPrice: Math.max(...prices),
      availability: "https://schema.org/InStock",
      url: pageUrl,
    },
  }).replace(/</g, "\\u003c");

  return new HTMLRewriter()
    .on("title", { element: (element) => element.setInnerContent(title) })
    .on('meta[name="description"]', { element: (element) => element.setAttribute("content", description) })
    .on("#canonical-link", { element: (element) => element.setAttribute("href", pageUrl) })
    .on("#og-title", { element: (element) => element.setAttribute("content", title) })
    .on("#og-description", { element: (element) => element.setAttribute("content", description) })
    .on("#og-url", { element: (element) => element.setAttribute("content", pageUrl) })
    .on("#og-image", { element: (element) => element.setAttribute("content", image) })
    .on("#og-image-alt", { element: (element) => element.setAttribute("content", alt) })
    .on("#twitter-title", { element: (element) => element.setAttribute("content", title) })
    .on("#twitter-description", { element: (element) => element.setAttribute("content", description) })
    .on("#twitter-image", { element: (element) => element.setAttribute("content", image) })
    .on("#twitter-image-alt", { element: (element) => element.setAttribute("content", alt) })
    .on("#product-structured-data", { element: (element) => element.setInnerContent(structuredData, { html: true }) })
    .on("#breadcrumb-name", { element: (element) => element.setInnerContent(product.name) })
    .on("#detail-name", { element: (element) => element.setInnerContent(product.name) })
    .on("#detail-badge", { element: (element) => element.setInnerContent(product.caption || "THE PLUSH STORY COLLECTION") })
    .on("#detail-description", { element: (element) => element.setInnerContent(product.description) })
    .on("#detail-price", { element: (element) => element.setInnerContent(`From ₹${Math.min(...prices)}`, { html: true }) })
    .on("#detail-art", { element: (element) => {
      if (!primaryImage) return;
      element.setInnerContent(
        `<img class="product-image" src="${escapeHtml(primaryImage)}" width="900" height="900" alt="${escapeHtml(product.name)}" loading="eager" decoding="async" fetchpriority="high">`,
        { html: true }
      );
    } })
    .transform(response);
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    let shouldRedirect = false;

    if (url.hostname === "www.plushstory.shop") {
      url.hostname = "plushstory.shop";
      shouldRedirect = true;
    }

    if (url.pathname.endsWith(".html")) {
      url.pathname = url.pathname === "/index.html" ? "/" : url.pathname.slice(0, -5);
      shouldRedirect = true;
    }

    if (shouldRedirect) {
      return Response.redirect(url.toString(), 301);
    }

    const { pathname } = url;

    if (pathname === "/product" && request.method === "GET") {
      const productId = url.searchParams.get("id") || "";
      const product = CATALOG[productId];
      if (product && env.ASSETS) {
        return renderProductPage(request, env, url, product);
      }
      if (productId && env.ASSETS) {
        const response = await env.ASSETS.fetch(new Request(new URL("/404", url), request));
        return new Response(response.body, { status: 404, headers: response.headers });
      }
    }

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
