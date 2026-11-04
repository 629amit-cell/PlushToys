function hasDatabase(env = {}) {
  return Boolean(env.ORDERS_DB && typeof env.ORDERS_DB.prepare === "function");
}

export async function savePendingOrder(env, order) {
  if (!hasDatabase(env)) return false;

  try {
    await env.ORDERS_DB.prepare(`
      INSERT INTO orders (
        id, order_number, razorpay_order_id, receipt, amount, currency,
        status, customer_name, customer_email, customer_phone,
        shipping_address, items_json, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      order.id,
      order.orderNumber,
      order.razorpayOrderId,
      order.receipt,
      order.amount,
      order.currency,
      "created",
      order.customer.name,
      order.customer.email,
      order.customer.phone,
      order.customer.fullAddress,
      order.itemsJson,
      order.createdAt,
    ).run();
    return true;
  } catch (error) {
    console.error("Could not save the pending order in D1.", error);
    throw new Error("The order could not be saved.");
  }
}

export async function markOrderPaid(env, { razorpayOrderId, paymentId }) {
  if (!hasDatabase(env)) return false;

  try {
    await env.ORDERS_DB.prepare(`
      UPDATE orders
      SET status = 'paid', razorpay_payment_id = ?, paid_at = ?
      WHERE razorpay_order_id = ? AND status <> 'paid'
    `).bind(paymentId, new Date().toISOString(), razorpayOrderId).run();
    return true;
  } catch (error) {
    console.error("Could not mark the order as paid in D1.", error);
    throw error;
  }
}
