const store = window.LittleWonderStore;
let cart = store.readCart();
const linesContainer = document.querySelector("#checkout-lines");
const emptyState = document.querySelector("#checkout-empty");
const totals = document.querySelector("#checkout-totals");
const form = document.querySelector("#checkout-form");

function renderCheckout() {
  const validCart = cart.filter((item) => store.products.some((product) => product.id === item.id));
  const subtotal = validCart.reduce((total, item) => {
    const product = store.products.find((entry) => entry.id === item.id);
    return total + store.productPrice(product, item.size) * item.quantity;
  }, 0);
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
  document.querySelector("#checkout-shipping").textContent = "To be confirmed";
  document.querySelector("#checkout-total").textContent = "To be confirmed";
}

linesContainer.addEventListener("click", (event) => {
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
    document.querySelector("#checkout-form-message").textContent = "Your bag couldn't be updated in this browser. Check storage settings and try again.";
    cart = store.readCart();
  }
  renderCheckout();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  document.querySelector("#checkout-form-message").textContent =
    "This is a store preview: payments aren't connected, no order was placed, and these details were not sent or saved.";
});

document.querySelector("#current-year").textContent = new Date().getFullYear();
renderCheckout();
