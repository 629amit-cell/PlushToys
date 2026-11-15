import assert from "node:assert/strict";
import {
  buildOrderConfirmationEmail,
  sendOrderConfirmationEmail,
} from "../functions/_lib/email.js";
import { queueOrderConfirmationEmail } from "../functions/_lib/order-email.js";

const order = {
  order_number: "PS-261115-TEST",
  customer_name: "Amit Tester",
  customer_email: "amit@example.com",
  customer_phone: "9876543210",
  shipping_address: "12 Test Lane, Bengaluru, Karnataka 560001, India",
  items_json: JSON.stringify([
    { id: "mixi-grey-bunny", name: "Grey Bunny", size: "Medium", quantity: 1, unitPrice: 899, lineTotal: 899 },
    { id: "mixi-cream-bear", name: "Cream Bear", size: "Large", quantity: 2, unitPrice: 600, lineTotal: 1200 },
  ]),
  amount: 209900,
  currency: "INR",
  paid_at: "2026-11-15T08:30:00.000Z",
  created_at: "2026-11-15T08:29:00.000Z",
  confirmation_email_sent_at: null,
};

const env = {
  RESEND_API_KEY: "re_test_dryrun",
  EMAIL_FROM: "Plush Story <support@plushstory.shop>",
  EMAIL_REPLY_TO: "plushsupportcare@gmail.com",
  SITE_URL: "https://plushstory.shop",
  ORDERS_DB: createFakeD1(order),
};

function createFakeD1(record) {
  return {
    prepare(sql) {
      const normalized = sql.replace(/\s+/g, " ").trim();
      return {
        bind(...args) {
          return {
            async run() {
              if (normalized.includes("SET confirmation_email_claimed_at = ?") &&
                  normalized.includes("confirmation_email_sent_at IS NULL")) {
                const [claimedAt, orderId, staleBefore] = args;
                assert.equal(orderId, "order_dryrun_123");
                if (record.confirmation_email_sent_at) return { meta: { changes: 0 } };
                if (record.confirmation_email_claimed_at &&
                    record.confirmation_email_claimed_at >= staleBefore) {
                  return { meta: { changes: 0 } };
                }
                record.confirmation_email_claimed_at = claimedAt;
                record.confirmation_email_error = null;
                return { meta: { changes: 1 } };
              }

              if (normalized.includes("confirmation_email_sent_at = ?") &&
                  normalized.includes("confirmation_email_message_id = ?")) {
                const [sentAt, messageId, orderId] = args;
                assert.equal(orderId, "order_dryrun_123");
                record.confirmation_email_sent_at = sentAt;
                record.confirmation_email_message_id = messageId;
                record.confirmation_email_claimed_at = null;
                record.confirmation_email_error = null;
                return { meta: { changes: 1 } };
              }

              if (normalized.includes("SET confirmation_email_claimed_at = NULL, confirmation_email_error = ?")) {
                const [errorMessage, orderId] = args;
                assert.equal(orderId, "order_dryrun_123");
                record.confirmation_email_claimed_at = null;
                record.confirmation_email_error = errorMessage;
                return { meta: { changes: 1 } };
              }

              return { meta: { changes: 0 } };
            },
            async first() {
              if (!normalized.includes("FROM orders")) return null;
              return {
                ...record,
                order_number: record.order_number,
                customer_name: record.customer_name,
                customer_email: record.customer_email,
                customer_phone: record.customer_phone,
                shipping_address: record.shipping_address,
                items_json: record.items_json,
                amount: record.amount,
                paid_at: record.paid_at,
                created_at: record.created_at,
              };
            },
          };
        },
      };
    },
  };
}

const built = buildOrderConfirmationEmail({ ...order }, env);
assert.match(built.subject, /PS-261115-TEST/);
assert.match(built.html, /Grey Bunny/);
assert.match(built.html, /Cream Bear/);
assert.match(built.html, /₹2,099/);
assert.match(built.html, /support@plushstory\.shop/);
assert.match(built.text, /Total paid: ₹2,099/);
assert.match(built.text, /Delivery usually takes 5-9 business days/);

let fetchCalls = 0;
globalThis.fetch = async (input, options) => {
  fetchCalls += 1;
  assert.equal(String(input), "https://api.resend.com/emails");
  const body = JSON.parse(options.body);
  assert.equal(body.from, "Plush Story <support@plushstory.shop>");
  assert.deepEqual(body.to, ["amit@example.com"]);
  assert.equal(body.reply_to, "plushsupportcare@gmail.com");
  assert.match(body.subject, /PS-261115-TEST/);
  assert.match(body.html, /Order confirmed/i);
  return new Response(JSON.stringify({ id: "email_dryrun_1" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

const sent = await sendOrderConfirmationEmail(env, order);
assert.equal(sent.messageId, "email_dryrun_1");
assert.equal(fetchCalls, 1);

const firstQueue = await queueOrderConfirmationEmail(env, "order_dryrun_123");
assert.equal(await firstQueue, undefined);
assert.equal(fetchCalls, 2);
assert.ok(order.confirmation_email_sent_at);
assert.equal(order.confirmation_email_message_id, "email_dryrun_1");

await queueOrderConfirmationEmail(env, "order_dryrun_123");
assert.equal(fetchCalls, 2, "a second webhook must not send a duplicate");

order.confirmation_email_sent_at = null;
order.confirmation_email_message_id = null;
order.confirmation_email_claimed_at = null;
globalThis.fetch = async () => new Response(JSON.stringify({ message: "Provider unavailable" }), {
  status: 503,
  headers: { "Content-Type": "application/json" },
});
await queueOrderConfirmationEmail(env, "order_dryrun_123");
assert.equal(order.confirmation_email_sent_at, null);
assert.equal(order.confirmation_email_claimed_at, null);
assert.match(order.confirmation_email_error, /Provider unavailable/);

globalThis.fetch = async () => new Response(JSON.stringify({ id: "email_dryrun_2" }), {
  status: 200,
  headers: { "Content-Type": "application/json" },
});
await queueOrderConfirmationEmail(env, "order_dryrun_123");
assert.ok(order.confirmation_email_sent_at);
assert.equal(order.confirmation_email_message_id, "email_dryrun_2");

console.log("Order confirmation email dry run passed");
console.log("  Branded HTML and text template: OK");
console.log("  Resend payload and message ID: OK");
console.log("  Duplicate webhook protection: OK");
console.log("  Failed send releases the claim for retry: OK");
console.log("  No real email was sent.");
