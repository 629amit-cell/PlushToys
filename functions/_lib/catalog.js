import { CATALOG } from "./catalog-data.js";
import { HttpError } from "./http.js";

const MAX_LINES = 50;
const MAX_QUANTITY = 20;

export function getShippingFeeInr(env = {}) {
  const value = Number(env.SHIPPING_FEE_INR ?? 0);
  if (!Number.isFinite(value) || value < 0) return 0;
  return Math.round(value);
}

export function summarizeCart(items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new HttpError(400, "Your bag is empty.");
  }
  if (items.length > MAX_LINES) {
    throw new HttpError(400, "Your bag has too many different items.");
  }

  const lines = [];
  let subtotal = 0;

  for (const item of items) {
    if (!item || typeof item !== "object") {
      throw new HttpError(400, "One of the bag items is invalid.");
    }

    const product = CATALOG[item.id];
    if (!product) {
      throw new HttpError(400, "One of the products is no longer available.");
    }

    const size = String(item.size || "");
    const unitPrice = product.prices[size];
    if (!Number.isInteger(unitPrice) || unitPrice <= 0) {
      throw new HttpError(400, `Choose a valid size for ${product.name}.`);
    }

    const quantity = Number(item.quantity);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
      throw new HttpError(400, `Choose a quantity between 1 and ${MAX_QUANTITY} for ${product.name}.`);
    }

    const lineTotal = unitPrice * quantity;
    subtotal += lineTotal;
    lines.push({
      id: item.id,
      name: product.name,
      size,
      quantity,
      unitPrice,
      lineTotal,
    });
  }

  return {
    lines,
    subtotal,
    itemCount: lines.reduce((total, line) => total + line.quantity, 0),
  };
}

export function getCheckoutSummary(items, env) {
  const cart = summarizeCart(items);
  const shippingFee = getShippingFeeInr(env);
  const total = cart.subtotal + shippingFee;

  if (!Number.isInteger(total) || total < 1) {
    throw new HttpError(400, "The order total is invalid.");
  }

  return {
    ...cart,
    shippingFee,
    total,
    amountPaise: total * 100,
    currency: "INR",
  };
}
