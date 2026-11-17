import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  purchaseEventId,
  queuePurchaseEvent,
  sendClientMetaEvent,
} from "../functions/_lib/meta-capi.js";

let capturedRequest;
let capturedEvent;

globalThis.fetch = async (url, options) => {
  capturedRequest = { url, options };
  capturedEvent = JSON.parse(options.body).data[0];
  return new Response(JSON.stringify({ events_received: 1, fbtrace_id: "test-trace" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

const env = { META_CAPI_ACCESS_TOKEN: "fake-token" };
const hash = (value) => createHash("sha256").update(value).digest("hex");
const request = new Request("https://plushstory.shop/api/meta-event", {
  method: "POST",
  headers: {
    "content-type": "application/json",
    "user-agent": "PlushStoryTest/1.0",
    "cf-connecting-ip": "203.0.113.10",
    "cookie": "_fbp=fb.1.1700000000000.123456789; _fbc=fb.1.1700000000000.AbCdEf",
    "origin": "https://plushstory.shop",
  },
});

const viewResult = await sendClientMetaEvent(env, request, {
  event_name: "ViewContent",
  event_id: "ps_viewcontent_test_123",
  event_source_url: "https://plushstory.shop/product?id=mixi-gingerbread",
  custom_data: {
    content_type: "product",
    content_ids: ["mixi-gingerbread"],
    content_name: "Gingerbread",
    value: 499,
    currency: "INR",
  },
  user_data: {
    email: "Customer@Example.com",
    phone: "+91 98765 43210",
    name: "Amit Tamrakar",
  },
});

assert.equal(viewResult.sent, true);
assert.equal(capturedEvent.event_name, "ViewContent");
assert.equal(capturedEvent.event_id, "ps_viewcontent_test_123");
assert.equal(capturedEvent.custom_data.value, 499);
assert.equal(capturedEvent.custom_data.currency, "INR");
assert.ok(capturedEvent.user_data.em?.[0]);
assert.notEqual(capturedEvent.user_data.em[0], "customer@example.com");
assert.equal(capturedEvent.user_data.em[0], hash("customer@example.com"));
assert.ok(capturedEvent.user_data.ph?.[0]);
assert.equal(capturedEvent.user_data.ph[0], hash("919876543210"));
assert.equal(capturedEvent.user_data.fbp, "fb.1.1700000000000.123456789");
assert.equal(capturedEvent.user_data.fbc, "fb.1.1700000000000.AbCdEf");
assert.equal(capturedEvent.user_data.client_ip_address, "203.0.113.10");
assert.equal(capturedEvent.user_data.client_user_agent, "PlushStoryTest/1.0");
assert.ok(capturedRequest.url.startsWith("https://graph.facebook.com/v23.0/4673915832877599/events"));

await sendClientMetaEvent(env, request, {
  event_name: "PageView",
  event_id: "ps_pageview_test_123",
  event_source_url: "https://plushstory.shop/",
  custom_data: { content_ids: ["not-sent-for-pageview"] },
});
assert.deepEqual(capturedEvent.custom_data, {});

const addToCartResult = await sendClientMetaEvent(env, request, {
  event_name: "AddToCart",
  event_id: "ps_addtocart_test_123",
  event_source_url: "https://plushstory.shop/product?id=mixi-gingerbread",
  custom_data: {
    content_type: "product",
    content_ids: ["mixi-gingerbread"],
    content_name: "Gingerbread",
    value: 499,
    currency: "INR",
    num_items: 1,
  },
});
assert.equal(addToCartResult.sent, true);
assert.equal(capturedEvent.event_name, "AddToCart");
assert.equal(capturedEvent.event_id, "ps_addtocart_test_123");
assert.ok("event_id" in capturedEvent);
assert.ok(!("event_id" in capturedEvent.custom_data));

const initiateCheckoutResult = await sendClientMetaEvent(env, request, {
  event_name: "InitiateCheckout",
  event_id: "ps_initiatecheckout_test_123",
  event_source_url: "https://plushstory.shop/checkout",
  custom_data: {
    content_type: "product",
    content_ids: ["mixi-gingerbread", "heart-balloon-teddy"],
    value: 762,
    currency: "INR",
    num_items: 2,
  },
});
assert.equal(initiateCheckoutResult.sent, true);
assert.equal(capturedEvent.event_name, "InitiateCheckout");
assert.equal(capturedEvent.event_id, "ps_initiatecheckout_test_123");
assert.ok("event_id" in capturedEvent);
assert.ok(!("event_id" in capturedEvent.custom_data));

const order = {
  order_number: "PS-261116-ABCD",
  customer_name: "Amit Tamrakar",
  customer_email: "amit@example.com",
  customer_phone: "9876543210",
  items_json: JSON.stringify([
    { id: "mixi-gingerbread", name: "Gingerbread", size: "Medium", quantity: 2, unitPrice: 499, lineTotal: 998 },
  ]),
  amount: 99800,
  currency: "INR",
  paid_at: new Date().toISOString(),
};
const purchaseEnv = {
  ...env,
  ORDERS_DB: {
    prepare() {
      return { bind() { return { first: async () => order }; } };
    },
  },
};

await queuePurchaseEvent(purchaseEnv, {
  razorpayOrderId: "order_test_123",
  eventSourceUrl: "https://plushstory.shop/checkout",
});

assert.equal(capturedEvent.event_name, "Purchase");
assert.equal(capturedEvent.event_id, purchaseEventId("PS-261116-ABCD", "order_test_123"));
assert.equal(capturedEvent.custom_data.value, 998);
assert.equal(capturedEvent.custom_data.currency, "INR");
assert.equal(capturedEvent.custom_data.num_items, 2);
assert.equal(capturedEvent.custom_data.contents[0].item_price, 499);
assert.ok(capturedEvent.user_data.em?.[0]);

console.log("Meta Conversions API dry run passed");
console.log("  ViewContent event ID and deduplication: OK");
console.log("  Hashed customer matching data: OK");
console.log("  PageView payload: OK");
console.log("  AddToCart top-level event_id: OK");
console.log("  InitiateCheckout top-level event_id: OK");
console.log("  Purchase event ID and contents: OK");
console.log("  No live Meta request was made.");
