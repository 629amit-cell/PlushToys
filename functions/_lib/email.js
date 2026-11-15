const DEFAULT_SITE_URL = "https://plushstory.shop";
const DEFAULT_FROM = "Plush Story <support@plushstory.shop>";
const DEFAULT_REPLY_TO = "support@plushstory.shop";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const orderDate = new Intl.DateTimeFormat("en-IN", {
  dateStyle: "medium",
  timeZone: "Asia/Kolkata",
});

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}

function parseItems(order) {
  try {
    const items = JSON.parse(order.items_json || "[]");
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

function lineTotal(item) {
  const total = Number(item.lineTotal);
  if (Number.isFinite(total) && total >= 0) return total;
  return Number(item.unitPrice || 0) * Number(item.quantity || 0);
}

function formatDate(value) {
  const date = new Date(value || Date.now());
  if (Number.isNaN(date.getTime())) return "";
  return orderDate.format(date);
}

function formatAddress(value) {
  return escapeHtml(value).replace(/\n/g, "<br>");
}

export function isOrderEmailConfigured(env = {}) {
  return Boolean(String(env.RESEND_API_KEY || "").trim());
}

export function buildOrderConfirmationEmail(order, env = {}) {
  const siteUrl = String(env.SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, "");
  const orderNumber = String(order.order_number || "");
  const customerName = String(order.customer_name || "there").trim();
  const firstName = customerName.split(/\s+/)[0] || "there";
  const items = parseItems(order);
  const total = Number(order.amount || 0) / 100;
  const subtotal = items.reduce((sum, item) => sum + lineTotal(item), 0);
  const shipping = Math.max(0, total - subtotal);
  const date = formatDate(order.paid_at || order.created_at);
  const itemRows = items.length
    ? items.map((item) => {
      const name = escapeHtml(item.name || "Plush");
      const size = escapeHtml(item.size || "Standard");
      const quantity = Math.max(1, Number(item.quantity) || 1);
      return `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #f0e8e1;color:#332d28;font-size:14px;line-height:1.5;">
            ${quantity} &times; ${name}
            <div style="padding-top:3px;color:#7a6f66;font-size:12px;">Size: ${size}</div>
          </td>
          <td align="right" valign="top" style="padding:12px 0 12px 12px;border-bottom:1px solid #f0e8e1;color:#332d28;font-size:14px;white-space:nowrap;">
            ${currency.format(lineTotal(item))}
          </td>
        </tr>`;
    }).join("")
    : `<tr><td colspan="2" style="padding:12px 0;color:#4a403a;font-size:14px;">Your order details are available in your confirmation.</td></tr>`;

  const textItems = items.length
    ? items.map((item) => {
      const quantity = Math.max(1, Number(item.quantity) || 1);
      return `- ${quantity} x ${item.name || "Plush"} (${item.size || "Standard"}) — ${currency.format(lineTotal(item))}`;
    }).join("\n")
    : "- Your order details are available in your confirmation.";

  const deliveryLine = shipping > 0 ? currency.format(shipping) : "Free";
  const supportLink = `mailto:support@plushstory.shop?subject=${encodeURIComponent(`Order help: ${orderNumber}`)}`;
  const shippingAddress = formatAddress(order.shipping_address);
  const phone = String(order.customer_phone || "").trim();
  const phoneLine = phone ? `<br>${escapeHtml(phone)}` : "";
  const subject = `Your Plush Story order ${orderNumber} is confirmed`;

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="x-apple-disable-message-reformatting">
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:#f6efe8;color:#332d28;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;mso-hide:all;">
    Order ${escapeHtml(orderNumber)} is confirmed. We usually dispatch within 1&ndash;2 business days.
  </div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f6efe8;">
    <tr>
      <td align="center" style="padding:28px 12px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#fffdfa;border:1px solid #eadfd5;border-radius:16px;overflow:hidden;">
          <tr>
            <td align="center" style="padding:32px 28px 16px;">
              <div style="font-family:Georgia,'Times New Roman',serif;font-size:28px;line-height:1.1;letter-spacing:-0.5px;color:#332d28;">Plush Story</div>
              <div style="padding-top:10px;color:#a65f4a;font-size:10px;font-weight:700;letter-spacing:2.4px;">ORDER CONFIRMED</div>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 28px 0;">
              <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:27px;line-height:1.2;font-weight:400;color:#332d28;">Thank you, ${escapeHtml(firstName)}.</h1>
              <p style="margin:14px 0 0;color:#4a403a;font-size:15px;line-height:1.7;">
                Your payment has been received and your order is confirmed. We&rsquo;re preparing it with care.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 28px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#fbf5ef;border:1px solid #f0e3d8;border-radius:10px;">
                <tr>
                  <td style="padding:14px 16px;color:#7a6f66;font-size:12px;line-height:1.5;">Order number</td>
                  <td align="right" style="padding:14px 16px;color:#332d28;font-size:13px;font-weight:700;line-height:1.5;">${escapeHtml(orderNumber)}</td>
                </tr>
                <tr>
                  <td style="padding:0 16px 14px;color:#7a6f66;font-size:12px;line-height:1.5;">Order date</td>
                  <td align="right" style="padding:0 16px 14px;color:#332d28;font-size:13px;line-height:1.5;">${escapeHtml(date)}</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 28px 0;">
              <h2 style="margin:0 0 6px;color:#332d28;font-size:13px;letter-spacing:1.2px;text-transform:uppercase;">Your plush friends</h2>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                ${itemRows}
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 28px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size:14px;line-height:1.8;">
                <tr>
                  <td style="color:#7a6f66;">Subtotal</td>
                  <td align="right" style="color:#332d28;">${currency.format(subtotal)}</td>
                </tr>
                <tr>
                  <td style="color:#7a6f66;">Delivery</td>
                  <td align="right" style="color:#332d28;">${deliveryLine}</td>
                </tr>
                <tr>
                  <td style="padding-top:8px;color:#332d28;font-weight:700;">Total paid</td>
                  <td align="right" style="padding-top:8px;color:#a33b2e;font-size:17px;font-weight:700;">${currency.format(total)}</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:26px 28px 0;">
              <h2 style="margin:0 0 8px;color:#332d28;font-size:13px;letter-spacing:1.2px;text-transform:uppercase;">Delivery address</h2>
              <div style="color:#4a403a;font-size:14px;line-height:1.7;">
                <strong>${escapeHtml(customerName)}</strong><br>
                ${shippingAddress}${phoneLine}
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 28px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f6efe8;border-radius:10px;">
                <tr>
                  <td style="padding:16px 18px;color:#4a403a;font-size:13px;line-height:1.7;">
                    <strong style="display:block;padding-bottom:4px;color:#332d28;font-size:13px;">What happens next?</strong>
                    We usually dispatch within 1&ndash;2 business days. Delivery usually takes 5&ndash;9 business days after dispatch. We&rsquo;ll email you again when your order ships.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 28px 30px;">
              <p style="margin:0;color:#4a403a;font-size:14px;line-height:1.7;">
                Need help with this order? Email
                <a href="${supportLink}" style="color:#a33b2e;font-weight:700;text-decoration:underline;">support@plushstory.shop</a>
                with your order number.
              </p>
              <p style="margin:16px 0 0;color:#8a7e74;font-size:11px;line-height:1.7;">
                Free delivery across India &middot; Prepaid orders only &middot; 7-day support for damaged, defective, or wrong items.<br>
                <a href="${siteUrl}/shipping-returns" style="color:#8a7e74;text-decoration:underline;">Shipping &amp; returns</a>
                &nbsp;&middot;&nbsp;
                <a href="${siteUrl}/privacy" style="color:#8a7e74;text-decoration:underline;">Privacy</a>
              </p>
            </td>
          </tr>
        </table>
        <p style="max-width:600px;margin:14px auto 0;color:#8a7e74;font-size:11px;line-height:1.6;text-align:center;">
          You&rsquo;re receiving this because you placed an order at
          <a href="${siteUrl}" style="color:#8a7e74;text-decoration:underline;">plushstory.shop</a>.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `Hi ${firstName},

Your payment has been received and your order is confirmed. We're preparing it with care.

Order number: ${orderNumber}
Order date: ${date}

Your plush friends:
${textItems}

Subtotal: ${currency.format(subtotal)}
Delivery: ${deliveryLine}
Total paid: ${currency.format(total)}

Delivery address:
${customerName}
${order.shipping_address || ""}${phone ? `\n${phone}` : ""}

What happens next?
We usually dispatch within 1-2 business days. Delivery usually takes 5-9 business days after dispatch. We'll email you again when your order ships.

Need help? Email support@plushstory.shop with your order number.

Free delivery across India. Prepaid orders only. 7-day support for damaged, defective, or wrong items.
${siteUrl}`;

  return { subject, html, text };
}

export async function sendOrderConfirmationEmail(env, order) {
  const apiKey = String(env.RESEND_API_KEY || "").trim();
  if (!apiKey) {
    throw new Error("Transactional email is not configured.");
  }
  if (!order?.customer_email) {
    throw new Error("The order does not have a customer email address.");
  }

  const { subject, html, text } = buildOrderConfirmationEmail(order, env);
  const baseUrl = String(env.RESEND_API_BASE_URL || "https://api.resend.com").replace(/\/$/, "");
  const response = await fetch(`${baseUrl}/emails`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: String(env.EMAIL_FROM || DEFAULT_FROM),
      to: [order.customer_email],
      reply_to: String(env.EMAIL_REPLY_TO || DEFAULT_REPLY_TO),
      subject,
      html,
      text,
    }),
    signal: AbortSignal.timeout(8000),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.id) {
    const detail = data.message || data.error || `HTTP ${response.status}`;
    throw new Error(`Transactional email could not be sent: ${detail}`);
  }

  return { messageId: String(data.id) };
}
