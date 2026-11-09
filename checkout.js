const store = window.PlushStoryStore;
let cart = store.readCart();

const linesContainer = document.querySelector("#checkout-lines");
const emptyState = document.querySelector("#checkout-empty");
const totals = document.querySelector("#checkout-totals");
const form = document.querySelector("#checkout-form");
const message = document.querySelector("#checkout-form-message");
const placeOrder = document.querySelector("#place-order");
const statusBox = document.querySelector("#checkout-status");
const statusTitle = document.querySelector("#checkout-status-title");
const statusText = document.querySelector("#checkout-status-text");
const shippingOutput = document.querySelector("#checkout-shipping");
const totalOutput = document.querySelector("#checkout-total");
const shippingNote = document.querySelector("#checkout-shipping-note");
const successPanel = document.querySelector("#checkout-success");

let checkoutConfig = {
  currency: "INR",
  shippingFeeInr: 0,
  paymentsEnabled: false,
};
let isProcessing = false;
let orderComplete = false;
let paymentSubmitted = false;
let razorpayScriptPromise = null;

function getValidCart() {
  return cart.filter((item) => {
    const product = store.products.find((entry) => entry.id === item.id);
    return Boolean(product) && Number.isInteger(item.quantity) && item.quantity > 0;
  });
}

function setMessage(text, tone = "") {
  message.textContent = text;
  message.classList.toggle("is-error", tone === "error");
  message.classList.toggle("is-success", tone === "success");
}

function setStatus(kind, title, text) {
  statusBox.classList.toggle("is-ready", kind === "ready");
  statusBox.classList.toggle("is-warning", kind === "warning");
  statusTitle.textContent = title;
  statusText.textContent = text;
}

function updatePaymentButton(validCart) {
  const hasItems = validCart.length > 0;
  const disabled = !hasItems ||
    !checkoutConfig.paymentsEnabled ||
    isProcessing ||
    paymentSubmitted ||
    orderComplete;

  placeOrder.disabled = disabled;
  form.setAttribute("aria-busy", String(isProcessing));
  linesContainer.classList.toggle("is-processing", isProcessing);
  placeOrder.innerHTML = isProcessing
    ? `Opening secure payment <span class="button-spinner" aria-hidden="true"></span>`
    : `Continue to secure payment <span aria-hidden="true">→</span>`;
}

function renderCheckout() {
  if (orderComplete) return;

  const validCart = getValidCart();
  const subtotal = validCart.reduce((total, item) => {
    const product = store.products.find((entry) => entry.id === item.id);
    return total + store.productPrice(product, item.size) * item.quantity;
  }, 0);
  const shippingFee = checkoutConfig.shippingFeeInr || 0;
  const total = subtotal + shippingFee;

  linesContainer.innerHTML = validCart.map((item) => {
    const product = store.products.find((entry) => entry.id === item.id);
    const unitPrice = store.productPrice(product, item.size);
    const sizeDetail = store.productSizeHeight(product, item.size);
    const sizeText = sizeDetail && sizeDetail !== item.size ? `${item.size} · ${sizeDetail}` : item.size;
    return `
      <article class="checkout-line">
        <div class="checkout-line-art" style="background:${product.color}">${store.productVisual(product, "lazy", "thumbnail")}</div>
        <div class="checkout-line-info">
          <a href="product.html?id=${encodeURIComponent(product.id)}">${product.name}</a>
          <span>Size: ${sizeText}</span>
          <span>${store.formatCurrency.format(unitPrice)} each</span>
          <div class="checkout-quantity" aria-label="Quantity for ${product.name}, ${item.size}">
            <button type="button" data-quantity="${product.id}" data-size="${item.size}" data-change="-1" aria-label="Remove one ${product.name}, ${item.size}">−</button>
            <span>${item.quantity}</span>
            <button type="button" data-quantity="${product.id}" data-size="${item.size}" data-change="1" aria-label="Add one ${product.name}, ${item.size}">+</button>
          </div>
        </div>
        <div class="checkout-line-end">
          <strong>${store.formatCurrency.format(unitPrice * item.quantity)}</strong>
          <button type="button" class="checkout-remove" data-remove="${product.id}" data-size="${item.size}" aria-label="Remove ${product.name}, ${item.size}">Remove</button>
        </div>
      </article>
    `;
  }).join("");

  const hasItems = validCart.length > 0;
  emptyState.hidden = hasItems;
  totals.hidden = !hasItems;
  form.hidden = !hasItems;
  document.querySelector("#checkout-subtotal").textContent = store.formatCurrency.format(subtotal);
  shippingOutput.textContent = shippingFee > 0
    ? store.formatCurrency.format(shippingFee)
    : "Free";
  totalOutput.textContent = store.formatCurrency.format(total);
  shippingNote.textContent = shippingFee > 0
    ? "Delivery is included in the total above."
    : "Free delivery on this order.";
  updatePaymentButton(validCart);
}

function loadRazorpayScript() {
  if (window.Razorpay) return Promise.resolve();
  if (razorpayScriptPromise) return razorpayScriptPromise;

  razorpayScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      if (window.Razorpay) resolve();
      else reject(new Error("Secure payment could not be loaded. Please try again."));
    };
    script.onerror = () => {
      razorpayScriptPromise = null;
      reject(new Error("We couldn't connect to secure payment. Check your connection and try again."));
    };
    document.head.appendChild(script);
  });

  return razorpayScriptPromise;
}

async function loadCheckoutConfig() {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch("/api/checkout-config", {
      cache: "no-store",
      signal: controller.signal,
    });
    if (!response.ok) throw new Error("Checkout configuration is unavailable.");
    const data = await response.json();
    const shippingFee = Number(data.shippingFeeInr);

    checkoutConfig = {
      currency: data.currency || "INR",
      shippingFeeInr: Number.isFinite(shippingFee) && shippingFee >= 0 ? shippingFee : 0,
      paymentsEnabled: Boolean(data.paymentsEnabled),
    };

    if (checkoutConfig.paymentsEnabled) {
      setStatus(
        "ready",
        "Secure checkout by Razorpay",
        "UPI, cards and netbanking. Your payment details are handled securely by Razorpay.",
      );
      const warmRazorpay = () => loadRazorpayScript().catch(() => {});
      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(warmRazorpay, { timeout: 3000 });
      } else {
        window.setTimeout(warmRazorpay, 1200);
      }
    } else {
      setStatus(
        "warning",
        "Payment setup needed",
        "Razorpay keys are not configured yet. Your bag is saved, but secure payment cannot start.",
      );
    }
  } catch (error) {
    console.error("Could not load checkout configuration.", error);
    checkoutConfig.paymentsEnabled = false;
    setStatus(
      "warning",
      "Secure payment unavailable",
      "We couldn't reach the payment service. Refresh the page or try again shortly.",
    );
  } finally {
    window.clearTimeout(timeout);
    renderCheckout();
  }
}

function getCustomerDetails() {
  const data = new FormData(form);
  const customer = {
    email: String(data.get("email") || "").trim(),
    firstName: String(data.get("firstName") || "").trim(),
    lastName: String(data.get("lastName") || "").trim(),
    phone: String(data.get("phone") || "").trim(),
    address: String(data.get("address") || "").trim(),
    city: String(data.get("city") || "").trim(),
    state: String(data.get("state") || "").trim(),
    postalCode: String(data.get("postalCode") || "").trim(),
  };
  customer.name = `${customer.firstName} ${customer.lastName}`.trim();
  return customer;
}

function showResult(order, customer, confirmed) {
  orderComplete = true;
  paymentSubmitted = true;

  document.querySelector(".checkout-title").hidden = true;
  statusBox.hidden = true;
  document.querySelector(".checkout-layout").hidden = true;
  successPanel.hidden = false;

  document.querySelector("#success-eyebrow").textContent = confirmed
    ? "PAYMENT RECEIVED"
    : "PAYMENT SUBMITTED";
  document.querySelector("#success-title").textContent = confirmed
    ? "Your order is confirmed."
    : "We're confirming your order.";
  document.querySelector("#success-lead").textContent = confirmed
    ? "Thank you. We'll prepare your plush friends with care."
    : "Your payment was submitted. We couldn't confirm it automatically yet, so please do not pay again.";
  document.querySelector("#success-order-number").textContent = order.orderNumber || order.orderId;
  document.querySelector("#success-total").textContent = store.formatCurrency.format(
    typeof order.total === "number" ? order.total : order.amount / 100,
  );
  document.querySelector("#success-email").textContent = customer.email;
  document.querySelector("#success-note").textContent = confirmed
    ? "Keep your order number handy. If you need help with this order, contact the store with this number."
    : "Your payment was submitted, but automatic confirmation did not complete. Keep this order number and contact the store before trying to pay again.";

  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function verifyPayment(payment, order, customer) {
  paymentSubmitted = true;
  isProcessing = true;
  setMessage("Verifying your payment…");
  renderCheckout();

  try {
    const response = await fetch("/api/verify-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        razorpay_order_id: payment.razorpay_order_id,
        razorpay_payment_id: payment.razorpay_payment_id,
        razorpay_signature: payment.razorpay_signature,
      }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.verified) {
      throw new Error(data.error || "We couldn't verify the payment.");
    }

    store.saveCart([]);
    cart = [];
    showResult({ ...order, ...data }, customer, true);
  } catch (error) {
    console.error("Payment verification failed.", error);
    store.saveCart([]);
    cart = [];
    showResult(order, customer, false);
  }
}

function openRazorpay(order, customer) {
  const options = {
    key: order.keyId,
    amount: order.amount,
    currency: order.currency,
    name: "Plush Story",
    description: `Order ${order.orderNumber}`,
    order_id: order.orderId,
    prefill: {
      name: customer.name,
      email: customer.email,
      contact: customer.phone,
    },
    notes: {
      order_number: order.orderNumber,
    },
    theme: {
      color: "#c8102e",
    },
    handler: (payment) => {
      verifyPayment(payment, order, customer);
    },
    modal: {
      ondismiss: () => {
        if (paymentSubmitted || orderComplete) return;
        isProcessing = false;
        setMessage("Payment window closed. Your bag is still saved, so you can try again when you're ready.");
        renderCheckout();
      },
    },
  };

  try {
    const razorpay = new window.Razorpay(options);
    razorpay.on("payment.failed", (response) => {
      if (paymentSubmitted || orderComplete) return;
      isProcessing = false;
      setMessage(
        response?.error?.description || "Payment failed. Your bag is still saved, so you can try again.",
        "error",
      );
      renderCheckout();
    });
    razorpay.open();
  } catch (error) {
    console.error("Could not open Razorpay Checkout.", error);
    isProcessing = false;
    setMessage("We couldn't open secure payment. Please try again.", "error");
    renderCheckout();
  }
}

linesContainer.addEventListener("click", (event) => {
  if (isProcessing || orderComplete) return;

  const quantityButton = event.target.closest("[data-quantity]");
  const removeButton = event.target.closest("[data-remove]");
  if (removeButton) {
    cart = cart.filter((item) => item.id !== removeButton.dataset.remove || item.size !== removeButton.dataset.size);
  } else if (quantityButton) {
    const item = cart.find((entry) => entry.id === quantityButton.dataset.quantity && entry.size === quantityButton.dataset.size);
    if (!item) return;
    item.quantity += Number(quantityButton.dataset.change);
    if (item.quantity <= 0) cart = cart.filter((entry) => entry.id !== item.id || entry.size !== item.size);
  } else {
    return;
  }

  if (!store.saveCart(cart)) {
    setMessage("Your bag couldn't be updated in this browser. Check storage settings and try again.", "error");
    cart = store.readCart();
  } else {
    setMessage("");
  }
  renderCheckout();
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (isProcessing || orderComplete || paymentSubmitted) return;

  const validCart = getValidCart();
  if (!validCart.length) {
    setMessage("Your bag is empty. Add a plush friend before checking out.", "error");
    return;
  }
  if (!checkoutConfig.paymentsEnabled) {
    setMessage("Secure payment is not available yet. Please try again shortly.", "error");
    return;
  }
  if (!form.reportValidity()) return;

  const customer = getCustomerDetails();
  isProcessing = true;
  setMessage("Creating your secure payment…");
  renderCheckout();

  try {
    await loadRazorpayScript();
    const response = await fetch("/api/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: validCart.map((item) => ({
          id: item.id,
          size: item.size,
          quantity: item.quantity,
        })),
        customer,
      }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.error || "We couldn't start secure payment. Please try again.");
    }
    if (!data.orderId || !data.keyId || !data.amount) {
      throw new Error("The payment response was incomplete. Please try again.");
    }
    openRazorpay(data, customer);
  } catch (error) {
    console.error("Could not start payment.", error);
    isProcessing = false;
    setMessage(error.message || "We couldn't start secure payment. Please try again.", "error");
    renderCheckout();
  }
});

document.querySelector("#current-year").textContent = new Date().getFullYear();
renderCheckout();
loadCheckoutConfig();
