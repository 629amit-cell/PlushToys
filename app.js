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

const PAGE_SIZE = 24;

let activeCategory = "all";
let searchTerm = "";
let currentProducts = [];
let renderedCount = 0;
let toastTimeout;
let cart = readStoredCart();

const productGrid = document.querySelector("#product-grid");
const categoryList = document.querySelector("#category-list");
const emptyState = document.querySelector("#empty-state");
const searchInput = document.querySelector("#search-input");
const clearSearchButton = document.querySelector("#clear-search");
const sortSelect = document.querySelector("#sort-select");
const resultStatus = document.querySelector("#shop-results");
const loadMoreButton = document.querySelector("#load-more");
const shopMore = document.querySelector("#shop-more");
const resetFiltersButton = document.querySelector("#reset-filters");
const cartDrawer = document.querySelector("#cart-drawer");
const drawerBackdrop = document.querySelector("#drawer-backdrop");
const cartItems = document.querySelector("#cart-items");
const cartEmpty = document.querySelector("#cart-empty");
const cartSummary = document.querySelector("#cart-summary");
const openCartButton = document.querySelector("#open-cart");
const backToTop = document.querySelector("#back-to-top");

function trackEvent(name, parameters) {
  if (window.PlushStoryTracking) window.PlushStoryTracking.track(name, parameters);
}

function saveCart() {
  if (!saveStoredCart(cart)) {
    showToast("Your bag couldn't be saved on this device.");
  }
}

function fromPrice(product) {
  return Math.min(...productSizesFor(product).map((size) => productPrice(product, size)));
}

function getFilteredProducts() {
  let visibleProducts = products.filter((product) => {
    const categoryName = categories.find((category) => category.id === product.category)?.name || product.category;
    const collectionNames = (product.collections || [])
      .map((id) => categories.find((category) => category.id === id)?.name || id)
      .join(" ");
    const matchesCategory = activeCategory === "all" ||
      product.category === activeCategory ||
      (product.collections || []).includes(activeCategory);
    const matchesSearch = `${product.name} ${product.caption} ${product.description} ${categoryName} ${collectionNames}`
      .toLowerCase()
      .includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  if (sortSelect.value === "big") {
    visibleProducts = [...visibleProducts].sort((a, b) => (b.sizeRank || 0) - (a.sizeRank || 0));
  } else if (sortSelect.value === "name") {
    visibleProducts = [...visibleProducts].sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortSelect.value === "price-low") {
    visibleProducts = [...visibleProducts].sort((a, b) => fromPrice(a) - fromPrice(b));
  } else if (sortSelect.value === "price-high") {
    visibleProducts = [...visibleProducts].sort((a, b) => fromPrice(b) - fromPrice(a));
  }
  return visibleProducts;
}

function productCard(product, index) {
  const sizes = productSizesFor(product);
  const priceLabel = sizes.length > 1 ? "From" : "One size";
  return `
    <article class="product-card">
      <a class="product-link" href="/product?id=${encodeURIComponent(product.id)}">
        <div class="product-art" style="background:${product.color}">
          ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ""}
          <span class="decor decor-one" aria-hidden="true">✦</span>
          <span class="decor decor-two" aria-hidden="true">✧</span>
          ${productVisual(product, index < 4 ? "eager" : "lazy", "card")}
        </div>
        <div class="product-details">
          <div class="product-name-row"><h3 class="product-name">${product.name}</h3><span class="product-price"><small>${priceLabel}</small>${formatCurrency.format(fromPrice(product))}</span></div>
          <p class="product-summary">${product.description}</p>
          <p class="product-caption">${product.caption}</p>
          <span class="product-view-link">View plush details <span aria-hidden="true">↗</span></span>
        </div>
      </a>
    </article>
  `;
}

function initializeProductVisuals() {
  document.querySelectorAll("[data-product]").forEach((element) => {
    const product = products.find((entry) => entry.id === element.dataset.product);
    if (!product) return;
    const loading = element.classList.contains("hero-plush") || element.classList.contains("avatar-plush")
      ? "eager"
      : "lazy";
    element.innerHTML = productVisual(product, loading);
  });
}

function renderProducts({ append = false } = {}) {
  if (!append) {
    currentProducts = getFilteredProducts();
    renderedCount = 0;
    productGrid.innerHTML = "";
  }

  const nextProducts = currentProducts.slice(renderedCount, renderedCount + PAGE_SIZE);
  productGrid.insertAdjacentHTML("beforeend", nextProducts.map((product, index) => productCard(product, renderedCount + index)).join(""));
  renderedCount += nextProducts.length;

  const total = currentProducts.length;
  const query = searchInput.value.trim();

  if (total === 0) {
    resultStatus.textContent = query
      ? `No plushies match “${query}”. Try another search or clear your filters.`
      : "No plushies match these filters. Try another category.";
  } else {
    resultStatus.textContent = `Showing ${renderedCount} of ${total} plush ${total === 1 ? "friend" : "friends"}.`;
  }

  emptyState.hidden = total > 0;
  shopMore.hidden = total === 0 || renderedCount >= total;
  const remaining = Math.max(0, total - renderedCount);
  loadMoreButton.innerHTML = `Show ${Math.min(PAGE_SIZE, remaining)} more ${remaining === 1 ? "plushie" : "plushies"} <span aria-hidden="true">↓</span>`;
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
  cart = cart.filter((item) => products.some((product) => product.id === item.id));
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
          <h3><a class="cart-line-name" href="/product?id=${encodeURIComponent(product.id)}">${product.name}</a></h3>
          <span class="cart-line-size">Size: ${sizeText}</span>
          <span class="cart-line-price">${formatCurrency.format(productPrice(product, item.size))} each</span>
          <div class="quantity-control" role="group" aria-label="Quantity for ${product.name}, ${item.size}">
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
}

function applyShippingConfig() {
  fetch("/api/checkout-config")
    .then((response) => response.ok ? response.json() : null)
    .then((config) => {
      if (!config) return;
      const fee = Number(config.shippingFeeInr || 0);
      const note = document.querySelector("#shipping-note");
      const disclaimer = document.querySelector(".checkout-disclaimer");
      if (fee > 0) {
        if (note) note.textContent = `Delivery: ${formatCurrency.format(fee)}.`;
        if (disclaimer) disclaimer.textContent = `Delivery charge of ${formatCurrency.format(fee)} is shown at checkout.`;
      } else {
        if (note) note.textContent = "Free delivery across India.";
        if (disclaimer) disclaimer.textContent = "Delivery is free. Secure payment is handled by Razorpay.";
      }
    })
    .catch(() => {
      // The static copy already explains free delivery.
    });
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
  openCartButton.setAttribute("aria-expanded", String(isOpen));
  document.body.classList.toggle("drawer-open", isOpen);
  if (isOpen) document.querySelector("#close-cart").focus();
  else openCartButton.focus();
}

function updateSearchUi() {
  clearSearchButton.hidden = searchInput.value.length === 0;
}

categoryList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  activeCategory = button.dataset.category;
  renderCategories();
  renderProducts();
});

searchInput.addEventListener("input", () => {
  searchTerm = searchInput.value.trim().toLowerCase();
  updateSearchUi();
  renderProducts();
});

searchInput.addEventListener("search", () => {
  searchTerm = searchInput.value.trim().toLowerCase();
  updateSearchUi();
  renderProducts();
});

searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && searchInput.value) {
    searchInput.value = "";
    searchTerm = "";
    updateSearchUi();
    renderProducts();
  }
});

clearSearchButton.addEventListener("click", () => {
  searchInput.value = "";
  searchTerm = "";
  updateSearchUi();
  renderProducts();
  searchInput.focus();
});

sortSelect.addEventListener("change", () => renderProducts());

loadMoreButton.addEventListener("click", () => {
  renderProducts({ append: true });
});

resetFiltersButton.addEventListener("click", () => {
  activeCategory = "all";
  searchInput.value = "";
  searchTerm = "";
  sortSelect.value = "big";
  updateSearchUi();
  renderCategories();
  renderProducts();
  searchInput.focus();
});

cartItems.addEventListener("click", (event) => {
  const quantityButton = event.target.closest("[data-quantity]");
  const removeButton = event.target.closest("[data-remove]");
  if (removeButton) {
    cart = cart.filter((item) => item.id !== removeButton.dataset.remove || item.size !== removeButton.dataset.size);
  } else if (quantityButton) {
    const item = cart.find((entry) => entry.id === quantityButton.dataset.quantity && entry.size === quantityButton.dataset.size);
    item.quantity += Number(quantityButton.dataset.change);
    if (item.quantity <= 0) cart = cart.filter((entry) => entry.id !== item.id || entry.size !== item.size);
    if (Number(quantityButton.dataset.change) > 0) {
      const product = products.find((entry) => entry.id === quantityButton.dataset.quantity);
      if (product) {
        trackEvent("AddToCart", {
          content_type: "product",
          content_ids: [product.id],
          content_name: product.name,
          value: productPrice(product, quantityButton.dataset.size),
          currency: "INR",
        });
      }
    }
  } else {
    return;
  }
  saveCart();
  renderCart();
});

openCartButton.addEventListener("click", () => setDrawerOpen(true));
document.querySelector("#close-cart").addEventListener("click", () => setDrawerOpen(false));
drawerBackdrop.addEventListener("click", () => setDrawerOpen(false));
document.querySelector("#keep-shopping").addEventListener("click", () => {
  setDrawerOpen(false);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelector("#shop").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
});
document.querySelector("#checkout-button").addEventListener("click", () => {
  window.location.href = "/checkout";
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

window.addEventListener("scroll", () => {
  backToTop.hidden = window.scrollY < 900;
}, { passive: true });

backToTop.addEventListener("click", () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
});

const initialQuery = new URLSearchParams(window.location.search).get("q");
if (initialQuery) {
  searchInput.value = initialQuery;
  searchTerm = initialQuery.trim().toLowerCase();
}
updateSearchUi();
document.querySelector("#current-year").textContent = new Date().getFullYear();
renderCategories();
initializeProductVisuals();
renderProducts();
renderCart();
applyShippingConfig();
