import { HttpError } from "./http.js";
import { getOrderByRazorpayOrderId } from "./orders.js";

const DEFAULT_PIXEL_ID = "4673915832877599";
const DEFAULT_GRAPH_VERSION = "v23.0";
const CLIENT_EVENTS = new Set([
  "PageView",
  "ViewContent",
  "AddToCart",
  "InitiateCheckout",
]);
const MAX_EVENT_ID_LENGTH = 100;
const MAX_URL_LENGTH = 2000;

function clean(value, maxLength) {
  return String(value ?? "").trim().slice(0, maxLength);
}

export function metaPixelId(env = {}) {
  return clean(env.META_PIXEL_ID || DEFAULT_PIXEL_ID, 40);
}

export function isMetaCapiConfigured(env = {}) {
  return Boolean(metaPixelId(env) && String(env.META_CAPI_ACCESS_TOKEN || "").trim());
}

function graphVersion(env = {}) {
  const value = clean(env.META_GRAPH_API_VERSION || DEFAULT_GRAPH_VERSION, 20);
  return /^v\d+\.\d+$/.test(value) ? value : DEFAULT_GRAPH_VERSION;
}

function safeEventId(value) {
  const eventId = clean(value, MAX_EVENT_ID_LENGTH);
  return /^[A-Za-z0-9._:-]+$/.test(eventId) ? eventId : "";
}

export function purchaseEventId(orderNumber, razorpayOrderId) {
  const source = clean(orderNumber || razorpayOrderId || "order", 80)
    .replace(/[^A-Za-z0-9._:-]/g, "_");
  return `purchase_${source}`.slice(0, MAX_EVENT_ID_LENGTH);
}

function normalizeEmail(value) {
  return clean(value, 320).toLowerCase();
}

function normalizePhone(value) {
  let digits = clean(value, 40).replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) return digits;
  if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  if (digits.length === 10) return `91${digits}`;
  return digits;
}

function normalizeText(value) {
  return clean(value, 120)
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]/gu, "");
}

function normalizeCountry(value) {
  const country = clean(value, 60).toLowerCase();
  if (country === "india" || country === "in") return "in";
  return country.replace(/[^a-z]/g, "").slice(0, 2);
}

async function sha256(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function hashedUserData(user = {}) {
  const data = {};
  const email = normalizeEmail(user.email);
  const phone = normalizePhone(user.phone);
  const name = clean(user.name, 120).split(/\s+/).filter(Boolean);
  const city = normalizeText(user.city);
  const state = normalizeText(user.state);
  const postalCode = clean(user.postalCode, 20).replace(/\s/g, "");
  const country = normalizeCountry(user.country);
  const externalId = normalizeText(user.externalId);

  if (email) data.em = [await sha256(email)];
  if (phone) data.ph = [await sha256(phone)];
  if (name[0]) data.fn = [await sha256(normalizeText(name[0]))];
  if (name.length > 1) data.ln = [await sha256(normalizeText(name.slice(1).join(" ")))];
  if (city) data.ct = [await sha256(city)];
  if (state) data.st = [await sha256(state)];
  if (postalCode) data.zp = [await sha256(postalCode)];
  if (country) data.country = [await sha256(country)];
  if (externalId) data.external_id = [await sha256(externalId)];

  return data;
}

function readCookie(cookieHeader, name) {
  if (!cookieHeader) return "";
  for (const part of cookieHeader.split(";")) {
    const separator = part.indexOf("=");
    if (separator < 0) continue;
    if (part.slice(0, separator).trim() !== name) continue;
    try {
      return decodeURIComponent(part.slice(separator + 1).trim());
    } catch {
      return "";
    }
  }
  return "";
}

function safeFbCookie(value) {
  const cookie = clean(value, 500);
  return /^fb\.\d+\.\d+\.[A-Za-z0-9._-]+$/.test(cookie) ? cookie : "";
}

function fbcFromUrl(eventSourceUrl) {
  try {
    const url = new URL(eventSourceUrl);
    const fbclid = url.searchParams.get("fbclid") || "";
    if (!/^[A-Za-z0-9._-]{1,500}$/.test(fbclid)) return "";
    return `fb.1.${Date.now()}.${fbclid}`;
  } catch {
    return "";
  }
}

function eventSourceUrl(value, request) {
  const fallback = request.url;
  try {
    const url = new URL(String(value || fallback));
    if (!["http:", "https:"].includes(url.protocol)) return fallback;
    const requestHost = new URL(request.url).host;
    const allowedHosts = new Set([requestHost, "plushstory.shop", "www.plushstory.shop"]);
    if (!allowedHosts.has(url.host)) return fallback;
    return url.toString().slice(0, MAX_URL_LENGTH);
  } catch {
    return fallback;
  }
}

function clientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for") || "";
  return clean(request.headers.get("cf-connecting-ip") || forwarded.split(",")[0], 80);
}

function clientUserAgent(request) {
  return clean(request.headers.get("user-agent"), 500);
}

function sanitizeUserInput(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) return {};
  return {
    email: clean(input.email, 320),
    phone: clean(input.phone, 40),
    name: clean(input.name, 120),
    city: clean(input.city, 120),
    state: clean(input.state, 120),
    postalCode: clean(input.postalCode, 20),
    country: clean(input.country, 60),
    externalId: clean(input.external_id || input.externalId, 120),
  };
}

async function userDataForRequest(request, body, extraUser = {}) {
  const input = sanitizeUserInput(body?.user_data);
  const user = { ...input, ...extraUser };
  const data = await hashedUserData(user);
  const ip = clientIp(request);
  const userAgent = clientUserAgent(request);
  const cookieHeader = request.headers.get("cookie") || "";
  const fbp = safeFbCookie(body?.fbp) || safeFbCookie(readCookie(cookieHeader, "_fbp"));
  const fbc = safeFbCookie(body?.fbc) ||
    safeFbCookie(readCookie(cookieHeader, "_fbc")) ||
    fbcFromUrl(body?.event_source_url || request.url);

  if (ip) data.client_ip_address = ip;
  if (userAgent) data.client_user_agent = userAgent;
  if (fbp) data.fbp = fbp;
  if (fbc) data.fbc = fbc;

  return data;
}

function sanitizeCustomData(input, eventName) {
  const data = {};
  if (eventName === "PageView" || !input || typeof input !== "object" || Array.isArray(input)) {
    return data;
  }

  const contentIds = Array.isArray(input.content_ids)
    ? input.content_ids.map((value) => clean(value, 100)).filter(Boolean).slice(0, 50)
    : [];
  if (contentIds.length) data.content_ids = contentIds;

  const contentType = clean(input.content_type, 40);
  if (contentType) data.content_type = contentType;

  const contentName = clean(input.content_name, 200);
  if (contentName) data.content_name = contentName;

  const contentCategory = clean(input.content_category, 200);
  if (contentCategory) data.content_category = contentCategory;

  const value = Number(input.value);
  if (Number.isFinite(value) && value >= 0) data.value = value;

  const currency = clean(input.currency || "INR", 3).toUpperCase();
  if (/^[A-Z]{3}$/.test(currency)) data.currency = currency;

  const numItems = Number(input.num_items);
  if (Number.isInteger(numItems) && numItems >= 0 && numItems <= 1000) {
    data.num_items = numItems;
  }

  const orderId = clean(input.order_id, 100);
  if (orderId) data.order_id = orderId;

  return data;
}

function parseItems(itemsJson) {
  try {
    const items = JSON.parse(itemsJson || "[]");
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

function serverEventSourceUrl(value) {
  try {
    const url = new URL(String(value || ""));
    if (["http:", "https:"].includes(url.protocol)) {
      return url.toString().slice(0, MAX_URL_LENGTH);
    }
  } catch {
    // Fall through to the production checkout URL.
  }
  return "https://plushstory.shop/checkout";
}

export async function sendMetaEvent(env, event) {
  const pixelId = metaPixelId(env);
  const accessToken = String(env.META_CAPI_ACCESS_TOKEN || "").trim();
  if (!pixelId || !accessToken) {
    return { sent: false, configured: false };
  }

  const payload = {
    data: [event],
  };
  const testEventCode = String(env.META_TEST_EVENT_CODE || "").trim();
  if (testEventCode) payload.test_event_code = testEventCode;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);

  try {
    const endpoint = `https://graph.facebook.com/${graphVersion(env)}/${encodeURIComponent(pixelId)}/events?access_token=${encodeURIComponent(accessToken)}`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      console.error("Meta Conversions API rejected an event.", {
        status: response.status,
        event: event?.event_name,
        code: data?.error?.code,
        subcode: data?.error?.error_subcode,
        message: data?.error?.message,
        trace: data?.error?.fbtrace_id,
      });
      return {
        sent: false,
        configured: true,
        status: response.status,
        error: data?.error?.message || "Meta rejected the event.",
      };
    }

    return {
      sent: true,
      configured: true,
      status: response.status,
      received: Number(data?.events_received || 0),
      trace: data?.fbtrace_id,
    };
  } catch (error) {
    console.error("Meta Conversions API request failed.", {
      event: event?.event_name,
      message: error instanceof Error ? error.message : String(error),
    });
    return { sent: false, configured: true, error: "Meta request failed." };
  } finally {
    clearTimeout(timeout);
  }
}

export async function sendClientMetaEvent(env, request, body) {
  const eventName = clean(body?.event_name, 40);
  if (!CLIENT_EVENTS.has(eventName)) {
    throw new HttpError(400, "This Meta event is not supported.");
  }

  const eventId = safeEventId(body?.event_id);
  if (!eventId) {
    throw new HttpError(400, "A valid Meta event ID is required.");
  }

  const url = eventSourceUrl(body?.event_source_url, request);
  const userData = await userDataForRequest(request, body);
  const event = {
    event_name: eventName,
    event_time: Math.floor(Date.now() / 1000),
    event_id: eventId,
    action_source: "website",
    event_source_url: url,
    user_data: userData,
    custom_data: sanitizeCustomData(body?.custom_data, eventName),
  };

  return sendMetaEvent(env, event);
}

export function queuePurchaseEvent(env, { razorpayOrderId, eventSourceUrl: sourceUrl }, waitUntil) {
  if (!razorpayOrderId || !isMetaCapiConfigured(env)) return null;

  const task = (async () => {
    try {
      const order = await getOrderByRazorpayOrderId(env, razorpayOrderId);
      if (!order) {
        console.error("Meta Purchase event skipped: the paid order was not found.", razorpayOrderId);
        return;
      }

      const items = parseItems(order.items_json);
      const orderNumber = clean(order.order_number || razorpayOrderId, 100);
      const contentIds = items.map((item) => clean(item?.id, 100)).filter(Boolean).slice(0, 50);
      const numItems = items.reduce((total, item) => {
        const quantity = Number(item?.quantity);
        return total + (Number.isInteger(quantity) && quantity > 0 ? quantity : 0);
      }, 0);
      const contents = items
        .map((item) => {
          const id = clean(item?.id, 100);
          const quantity = Number(item?.quantity);
          const unitPrice = Number(item?.unitPrice);
          if (!id || !Number.isInteger(quantity) || quantity < 1) return null;
          return {
            id,
            quantity,
            ...(Number.isFinite(unitPrice) && unitPrice >= 0 ? { item_price: unitPrice } : {}),
          };
        })
        .filter(Boolean)
        .slice(0, 50);
      const value = Number(order.amount);
      const event = {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        event_id: purchaseEventId(order.order_number, razorpayOrderId),
        action_source: "website",
        event_source_url: serverEventSourceUrl(sourceUrl),
        user_data: await hashedUserData({
          email: order.customer_email,
          phone: order.customer_phone,
          name: order.customer_name,
          country: "India",
        }),
        custom_data: {
          currency: clean(order.currency || "INR", 3).toUpperCase(),
          value: Number.isFinite(value) ? value / 100 : 0,
          content_type: "product",
          ...(contentIds.length ? { content_ids: contentIds } : {}),
          ...(contents.length ? { contents } : {}),
          ...(numItems ? { num_items: numItems } : {}),
          order_id: orderNumber,
        },
      };

      const result = await sendMetaEvent(env, event);
      if (!result.sent && result.configured !== false) {
        console.error("Meta Purchase event was not accepted.", orderNumber);
      }
    } catch (error) {
      console.error("Meta Purchase event failed.", {
        order: razorpayOrderId,
        message: error instanceof Error ? error.message : String(error),
      });
    }
  })();

  if (typeof waitUntil === "function") {
    waitUntil(task);
  } else {
    task.catch((error) => {
      console.error("Unexpected Meta Purchase event failure.", error);
    });
  }

  return task;
}
