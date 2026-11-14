import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { CATALOG } from "../functions/_lib/catalog-data.js";
import { onRequestPost as createOrder } from "../functions/api/create-order.js";
import { onRequestPost as verifyPayment } from "../functions/api/verify-payment.js";

const keyId = "rzp_test_dryrun";
const keySecret = "dry_run_key_secret";
const env = {
  RAZORPAY_KEY_ID: keyId,
  RAZORPAY_KEY_SECRET: keySecret,
  RAZORPAY_WEBHOOK_SECRET: "dry_run_webhook_secret",
  ORDERS_DB: {
    prepare(sql) {
      return {
        bind(...args) {
          return {
            async run() {
              dbCalls.push({ sql: sql.trim().split(/\s+/).slice(0, 3).join(" "), args });
              return { success: true };
            },
          };
        },
      };
    },
  },
};

const dbCalls = [];
const apiCalls = [];
const [productId, product] = Object.entries(CATALOG)[0];
const [size, price] = Object.entries(product.prices)[0];
const amountPaise = price * 100;
const customer = {
  firstName: "Amit",
  lastName: "Tester",
  email: "amit@example.com",
  phone: "9876543210",
  address: "12 Test Lane",
  city: "Bengaluru",
  state: "Karnataka",
  postalCode: "560001",
};
const items = [{ id: productId, size, quantity: 1 }];

let createdOrder = null;

globalThis.fetch = async (input, options = {}) => {
  const url = new URL(input);
  apiCalls.push({ path: url.pathname, method: options.method || "GET", body: options.body });

  if (url.pathname === "/v1/orders" && options.method === "POST") {
    const body = JSON.parse(options.body);
    assert.equal(body.amount, amountPaise);
    assert.equal(body.currency, "INR");
    assert.equal(body.notes.order_number.startsWith("PS-"), true);
    assert.equal(body.notes.cart_summary.includes(product.name), true);
    createdOrder = {
      id: "order_dryrun123",
      amount: body.amount,
      currency: body.currency,
      notes: body.notes,
    };
    return jsonResponse(createdOrder);
  }

  if (url.pathname === "/v1/orders/order_dryrun123") {
    return jsonResponse(createdOrder);
  }

  if (url.pathname === "/v1/payments/pay_dryrun123") {
    return jsonResponse({
      id: "pay_dryrun123",
      order_id: "order_dryrun123",
      status: "captured",
      amount: amountPaise,
      currency: "INR",
    });
  }

  throw new Error(`Unexpected Razorpay API call: ${options.method || "GET"} ${url.pathname}`);
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function request(path, body) {
  return new Request(`https://plushstory.shop${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: "https://plushstory.shop",
    },
    body: JSON.stringify(body),
  });
}

const createResponse = await createOrder({
  request: request("/api/create-order", { customer, items }),
  env,
});
const created = await createResponse.json();
assert.equal(createResponse.status, 200);
assert.equal(created.orderId, "order_dryrun123");
assert.equal(created.amount, amountPaise);
assert.equal(created.total, price);
assert.equal(created.keyId, keyId);
assert.equal(created.orderNumber.startsWith("PS-"), true);
assert.equal(dbCalls.some((call) => call.sql.startsWith("INSERT INTO orders")), true);

const paymentId = "pay_dryrun123";
const signature = createHmac("sha256", keySecret)
  .update(`order_dryrun123|${paymentId}`)
  .digest("hex");

const verifyResponse = await verifyPayment({
  request: request("/api/verify-payment", {
    razorpay_order_id: "order_dryrun123",
    razorpay_payment_id: paymentId,
    razorpay_signature: signature,
  }),
  env,
});
const verified = await verifyResponse.json();
assert.equal(verifyResponse.status, 200);
assert.equal(verified.verified, true);
assert.equal(verified.total, price);
assert.equal(verified.orderNumber, created.orderNumber);
assert.equal(dbCalls.some((call) => call.sql.startsWith("UPDATE orders")), true);

const badSignatureResponse = await verifyPayment({
  request: request("/api/verify-payment", {
    razorpay_order_id: "order_dryrun123",
    razorpay_payment_id: paymentId,
    razorpay_signature: "deadbeef",
  }),
  env,
});
assert.equal(badSignatureResponse.status, 400);
assert.match((await badSignatureResponse.json()).error, /signature/i);

const invalidCustomerResponse = await createOrder({
  request: request("/api/create-order", {
    customer: { ...customer, postalCode: "000" },
    items,
  }),
  env,
});
assert.equal(invalidCustomerResponse.status, 400);
assert.match((await invalidCustomerResponse.json()).error, /PIN code/i);

console.log("Checkout dry run passed");
console.log(`  Product: ${product.name} (${size}) at ₹${price}`);
console.log(`  Razorpay order: ${created.orderId}`);
console.log(`  Payment verification: ${verified.status}, ₹${verified.total}`);
console.log(`  D1 writes: ${dbCalls.length}`);
console.log(`  Razorpay API calls: ${apiCalls.length}`);
console.log("  No live Razorpay request or real payment was made.");
