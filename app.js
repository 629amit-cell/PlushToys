const {
  products,
  categories,
  productVisual,
  productPrice,
  productSizesFor,
  productSizeHeight,
  formatCurrency,
  readCart: readStoredCart,
  saveCart: saveStoredCart,
} = window.PlushStoryStore;
let activeCategory = "all";
let searchTerm = "";
let toastTimeout;

const productGrid = document.querySelector("#product-grid");
const categoryList = document.querySelector("#category-list");
const emptyState = document.querySelector("#empty-state");
const searchInput = document.querySelector("#search-input");
const sortSelect = document.querySelector("#sort-select");
const cartDrawer = document.querySelector("#cart-drawer");
const drawerBackdrop = document.querySelector("#drawer-backdrop");
const cartItems = document.querySelector("#cart-items");
const cartEmpty = document.querySelector("#cart-empty");
const cartSummary = document.querySelector("#cart-summary");

let cart = readStoredCart();

function saveCart() {
  if (!saveStoredCart(cart)) {
    showToast("Your bag couldn't be saved on this device.");
  }
}

function renderProducts() {
  let visibleProducts = products.filter((product) => {
    const categoryName = categories.find((category) => category.id === product.category)?.name || product.category;
    const collectionNames = (product.collections || [])
      .map((id) => categories.find((category) => category.id === id)?.name || id)
      .join(" ");
    const matchesCategory = activeCategory === "all" ||
      product.category === activeCategory ||
      (product.collections || []).includes(activeCategory);
    const matchesSearch = `${product.name} ${product.caption} ${categoryName} ${collectionNames}`
      .toLowerCase()
      .includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  if (sortSelect.value === "big") {
    visibleProducts = [...visibleProducts].sort((a, b) => (b.sizeRank || 0) - (a.sizeRank || 0));
  } else if (sortSelect.value === "name") {
    visibleProducts = [...visibleProducts].sort((a, b) => a.name.localeCompare(b.name));
  }

  productGrid.innerHTML = visibleProducts.map((product, index) => `
    <article class="product-card">
      <a class="product-link" href="product.html?id=${encodeURIComponent(product.id)}">
        <div class="product-art" style="background:${product.color}">
          ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ""}
          <span class="decor decor-one" aria-hidden="true">✦</span>
          <span class="decor decor-two" aria-hidden="true">✧</span>
          ${productVisual(product, index < 8 ? "eager" : "lazy", "card")}
        </div>
        <div class="product-details">
          <div class="product-name-row"><h3 class="product-name">${product.name}</h3><span class="product-price"><small>Launch offer · From</small>${formatCurrency.format(productPrice(product, productSizesFor(product)[0]))}</span></div>
          <p class="product-summary">${product.description}</p>
          <p class="product-caption">${product.caption}</p>
          <span class="product-view-link">View plush details <span aria-hidden="true">↗</span></span>
        </div>
      </a>
    </article>
  `).join("");
  emptyState.hidden = visibleProducts.length > 0;
  document.querySelectorAll("[data-product]").forEach((element) => {
    const product = products.find((entry) => entry.id === element.dataset.product);
    if (product) {
      const loading = element.classList.contains("hero-plush") || element.classList.contains("avatar-plush")
        ? "eager"
        : "lazy";
      element.innerHTML = productVisual(product, loading);
    }
  });
}

function renderCategories() {
  const availableCategories = categories.filter((category) =>
    products.some((product) =>
      product.category === category.id ||
      (product.collections || []).includes(category.id)
    )
  );
  const categoryOptions = [
    { id: "all", name: "All plush toys" },
    ...availableCategories,
  ];
  const countForCategory = (categoryId) => categoryId === "all"
    ? products.length
    : products.filter((product) =>
        product.category === categoryId ||
        (product.collections || []).includes(categoryId)
      ).length;
  document.querySelector("#catalog-count").textContent = products.length;
  categoryList.innerHTML = categoryOptions.map((category) => {
    const count = countForCategory(category.id);
    return `
      <button class="category-chip${activeCategory === category.id ? " is-active" : ""}" data-category="${category.id}" type="button" aria-pressed="${activeCategory === category.id}">
        ${category.name}<span class="category-count">${count}</span>
      </button>
    `;
  }).join("");
}

function renderCart() {
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  document.querySelector("#cart-count").textContent = count;
  cartEmpty.hidden = count > 0;
  cartSummary.hidden = count === 0;

  cartItems.innerHTML = cart.map((item) => {
    const product = products.find((entry) => entry.id === item.id);
    const sizeDetail = productSizeHeight(product, item.size);
    const sizeText = sizeDetail && sizeDetail !== item.size ? `${item.size} · ${sizeDetail}` : item.size;
    return `
      <article class="cart-line">
        <div class="cart-line-art" style="background:${product.color}" aria-hidden="true">${productVisual(product, "lazy", "thumbnail")}</div>
        <div>
          <h3>${product.name}</h3>
          <span class="cart-line-size">Size: ${sizeText}</span>
          <span class="cart-line-price">${formatCurrency.format(productPrice(product, item.size))} each</span>
          <div class="quantity-control" aria-label="Quantity for ${product.name}, ${item.size}">
            <button type="button" data-quantity="${product.id}" data-size="${item.size}" data-change="-1" aria-label="Remove one ${product.name}, ${item.size}">−</button>
            <span>${item.quantity}</span>
            <button type="button" data-quantity="${product.id}" data-size="${item.size}" data-change="1" aria-label="Add one ${product.name}, ${item.size}">+</button>
          </div>
        </div>
        <button class="remove-item" type="button" data-remove="${product.id}" data-size="${item.size}" aria-label="Remove ${product.name}, ${item.size}, from bag">Remove</button>
      </article>
    `;
  }).join("");

  const subtotal = cart.reduce((total, item) => {
    const product = products.find((entry) => entry.id === item.id);
    return total + productPrice(product, item.size) * item.quantity;
  }, 0);
  document.querySelector("#cart-subtotal").textContent = formatCurrency.format(subtotal);
  document.querySelector("#shipping-note").textContent =
    "Delivery charges are shown at checkout before payment.";
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => toast.classList.remove("is-visible"), 2400);
}

function setDrawerOpen(isOpen) {
  cartDrawer.classList.toggle("is-open", isOpen);
  cartDrawer.setAttribute("aria-hidden", String(!isOpen));
  cartDrawer.inert = !isOpen;
  drawerBackdrop.hidden = !isOpen;
  document.body.classList.toggle("drawer-open", isOpen);
  if (isOpen) document.querySelector("#close-cart").focus();
  else document.querySelector("#open-cart").focus();
}

document.querySelector(".category-list").addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  activeCategory = button.dataset.category;
  renderCategories();
  renderProducts();
});

searchInput.addEventListener("input", () => {
  searchTerm = searchInput.value.trim().toLowerCase();
  renderProducts();
});
sortSelect.addEventListener("change", renderProducts);

cartItems.addEventListener("click", (event) => {
  const quantityButton = event.target.closest("[data-quantity]");
  const removeButton = event.target.closest("[data-remove]");
  if (removeButton) {
    cart = cart.filter((item) => item.id !== removeButton.dataset.remove || item.size !== removeButton.dataset.size);
  } else if (quantityButton) {
    const item = cart.find((entry) => entry.id === quantityButton.dataset.quantity && entry.size === quantityButton.dataset.size);
    item.quantity += Number(quantityButton.dataset.change);
    if (item.quantity <= 0) cart = cart.filter((entry) => entry.id !== item.id || entry.size !== item.size);
  } else {
    return;
  }
  saveCart();
  renderCart();
});

document.querySelector("#open-cart").addEventListener("click", () => setDrawerOpen(true));
document.querySelector("#close-cart").addEventListener("click", () => setDrawerOpen(false));
drawerBackdrop.addEventListener("click", () => setDrawerOpen(false));
document.querySelector("#keep-shopping").addEventListener("click", () => setDrawerOpen(false));
document.querySelector("#checkout-button").addEventListener("click", () => {
  window.location.href = "checkout.html";
});
document.addEventListener("keydown", (event) => {
  if (!cartDrawer.classList.contains("is-open")) return;
  if (event.key === "Escape") {
    setDrawerOpen(false);
    return;
  }
  if (event.key === "Tab") {
    const focusable = [...cartDrawer.querySelectorAll("button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])")]
      .filter((element) => element.getClientRects().length > 0 && !element.closest("[hidden]"));
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

document.querySelector("#current-year").textContent = new Date().getFullYear();
renderCategories();
renderProducts();
renderCart();
