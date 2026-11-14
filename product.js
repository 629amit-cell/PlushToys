const store = window.PlushStoryStore;
const productId = new URLSearchParams(window.location.search).get("id");
const product = store.products.find((item) => item.id === productId);
const toast = document.querySelector("#toast");
const toastMessage = document.querySelector("#toast-message");
const toastAction = document.querySelector("#toast-action");
const toastClose = document.querySelector("#toast-close");
const mobileBar = document.querySelector("#detail-mobile-bar");
const mobileBagLink = document.querySelector("#mobile-bag-link");
const mobileCartCount = document.querySelector("#mobile-cart-count");
let quantity = 1;
let toastTimeout;
let toastReturnFocus = null;

function hideToast() {
  window.clearTimeout(toastTimeout);
  if (toast) toast.classList.remove("is-visible");
}

function scheduleToastHide(delay) {
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(hideToast, delay);
}

function showToast(message, options = {}) {
  if (!toast || !toastMessage) return;
  toastMessage.textContent = message;
  if (toastAction) {
    toastAction.hidden = !options.action;
    if (options.action) toastAction.href = options.href || "/checkout";
  }
  toastReturnFocus = options.returnFocus || null;
  toast.classList.add("is-visible");
  scheduleToastHide(options.action ? 7000 : 3200);
}

if (toast) {
  toast.addEventListener("mouseenter", () => window.clearTimeout(toastTimeout));
  toast.addEventListener("mouseleave", () => {
    if (toast.classList.contains("is-visible")) scheduleToastHide(3000);
  });
  toast.addEventListener("focusin", () => window.clearTimeout(toastTimeout));
  toast.addEventListener("focusout", (event) => {
    if (!toast.contains(event.relatedTarget) && toast.classList.contains("is-visible")) {
      scheduleToastHide(3000);
    }
  });
}
if (toastClose) {
  toastClose.addEventListener("click", () => {
    hideToast();
    if (toastReturnFocus && document.contains(toastReturnFocus)) {
      toastReturnFocus.focus({ preventScroll: true });
    }
    toastReturnFocus = null;
  });
}

function trackEvent(name, parameters) {
  if (window.PlushStoryTracking) window.PlushStoryTracking.track(name, parameters);
}

function updateBagCount(cart) {
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  const headerCount = document.querySelector("#detail-cart-count");
  if (headerCount) headerCount.textContent = count;
  if (mobileCartCount) mobileCartCount.textContent = count;
  if (mobileBagLink) {
    mobileBagLink.setAttribute("aria-label", `View bag, ${count} ${count === 1 ? "item" : "items"}`);
  }
}

function addProductToBag() {
  const cart = store.readCart();
  const selected = document.querySelector('input[name="product-size"]:checked');
  if (!selected) return false;
  const size = selected.value;
  const existing = cart.find((item) => item.id === product.id && item.size === size);
  if (existing) existing.quantity += quantity;
  else cart.push({ id: product.id, size, quantity });
  if (!store.saveCart(cart)) {
    showToast("Your bag could not be saved in this browser. Please check storage settings.");
    return false;
  }
  updateBagCount(cart);
  trackEvent("AddToCart", {
    content_type: "product",
    content_ids: [product.id],
    content_name: product.name,
    content_category: product.caption,
    value: store.productPrice(product, size) * quantity,
    currency: "INR",
    num_items: quantity,
  });
  return true;
}

function renderRecommendations() {
  const relatedProducts = store.products
    .filter((item) => item.id !== product.id)
    .sort((a, b) => Number(b.category === product.category) - Number(a.category === product.category) || (b.sizeRank || 0) - (a.sizeRank || 0))
    .slice(0, 3)
    .map((item) => `
      <a class="recommendation-card" href="/product?id=${encodeURIComponent(item.id)}">
        <div class="recommendation-art" style="background:${item.color}">${store.productVisual(item, "lazy", "card")}</div>
        <span>${item.name}</span>
        <strong>From ${store.formatCurrency.format(store.productPrice(item, store.productSizesFor(item)[0]))}</strong>
      </a>
    `).join("");
  document.querySelector("#recommendation-grid").innerHTML = relatedProducts;
}

function updateMetaTags(product) {
  const url = `${window.location.origin}/product?id=${encodeURIComponent(product.id)}`;
  const title = `${product.name} — Plush Story`;
  const description = `${product.description} Free delivery across India, with secure Razorpay checkout.`;
  const image = new URL(`assets/og/products/${product.id}.jpg?v=1`, window.location.origin).href;
  const alt = `${product.name} from Plush Story`;
  const set = (selector, value, attribute = "content") => {
    const element = document.querySelector(selector);
    if (element) element.setAttribute(attribute, value);
  };
  set("#canonical-link", url, "href");
  set('meta[name="description"]', description);
  set("#og-title", title);
  set("#og-description", description);
  set("#og-url", url);
  set("#og-image", image);
  set("#og-image-alt", alt);
  set('meta[property="og:image:width"]', "1200");
  set('meta[property="og:image:height"]', "630");
  set("#twitter-title", title);
  set("#twitter-description", description);
  set("#twitter-image", image);
  set("#twitter-image-alt", alt);
  const structuredData = document.querySelector("#product-structured-data");
  if (structuredData) {
    const sizes = store.productSizesFor(product);
    const prices = sizes.map((size) => store.productPrice(product, size));
    structuredData.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description: product.description,
      image: [image],
      sku: product.id,
      brand: { "@type": "Brand", name: "Plush Story" },
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "INR",
        lowPrice: Math.min(...prices),
        highPrice: Math.max(...prices),
        availability: "https://schema.org/InStock",
        url,
      },
    });
  }
}

function initializeProduct() {
  const yearNode = document.querySelector("#current-year");
  if (yearNode) yearNode.textContent = new Date().getFullYear();
  updateBagCount(store.readCart());

  if (!product) {
    if (mobileBar) mobileBar.hidden = true;
    document.querySelector("#product-detail").innerHTML = `
      <div class="product-unavailable">
        <span class="eyebrow">A LITTLE MIX-UP</span>
        <h1>We couldn't find that plush pal.</h1>
        <p>Have a look through the collection to find your new favorite.</p>
        <a class="button button-dark" href="/#shop">Browse the collection <span aria-hidden="true">→</span></a>
      </div>
    `;
    return;
  }

  document.title = `${product.name} — Plush Story`;
  document.querySelector("#breadcrumb-name").textContent = product.name;
  document.querySelector("#detail-badge").textContent = product.caption;
  document.querySelector("#detail-name").textContent = product.name;
  document.querySelector("#detail-description").textContent = product.description;
  const sizes = store.productSizesFor(product);
  const defaultSize = sizes.includes("Medium") ? "Medium" : sizes[0];
  document.querySelector("#product-sizes").innerHTML = sizes.map((size) => `
    <label class="size-option">
      <input type="radio" name="product-size" value="${size}"${size === defaultSize ? " checked" : ""}>
      <span>${size}<small>${store.formatCurrency.format(store.productPrice(product, size))}</small></span>
    </label>
  `).join("");
  document.querySelector("#product-size-chart").innerHTML = sizes.map((size) => `
    <tr><th scope="row">${size}</th><td>${store.productSizeHeight(product, size)}</td><td>${store.formatCurrency.format(store.productPrice(product, size))}</td></tr>
  `).join("");

  const updateSelectedSizePrice = () => {
    const selected = document.querySelector('input[name="product-size"]:checked');
    if (!selected) return;
    const selectedSize = selected.value;
    const price = store.productPrice(product, selectedSize);
    document.querySelector("#detail-price").textContent = store.formatCurrency.format(price);
    const mobileSize = document.querySelector("#detail-mobile-size");
    const mobilePrice = document.querySelector("#detail-mobile-price");
    if (mobileSize) mobileSize.textContent = `${selectedSize} · ${quantity} ${quantity === 1 ? "plush" : "plushies"}`;
    if (mobilePrice) mobilePrice.textContent = store.formatCurrency.format(price * quantity);
  };
  document.querySelector("#product-sizes").addEventListener("change", updateSelectedSizePrice);
  updateSelectedSizePrice();

  const categoryName = store.categories.find((entry) => entry.id === product.category)?.name || product.caption;
  const collectionNames = (product.collections || [])
    .map((id) => store.categories.find((entry) => entry.id === id)?.name || id)
    .filter((name) => name !== categoryName);
  const collectionLabel = [categoryName, ...collectionNames].join(" · ");
  const sizePrices = sizes.map((size) => store.productPrice(product, size));
  const lowPrice = Math.min(...sizePrices);
  const highPrice = Math.max(...sizePrices);
  const priceRange = lowPrice === highPrice
    ? store.formatCurrency.format(lowPrice)
    : `${store.formatCurrency.format(lowPrice)} – ${store.formatCurrency.format(highPrice)}`;
  const sizeSummary = sizes.length === 1
    ? `One size: ${sizes[0]}${store.productSizeHeight(product, sizes[0]) !== sizes[0] ? ` — ${store.productSizeHeight(product, sizes[0])}` : ""} — ${store.formatCurrency.format(lowPrice)}.`
    : `Available in ${sizes.join(", ")} — from ${store.formatCurrency.format(lowPrice)}.`;
  const heightSummary = sizes
    .map((size) => {
      const height = store.productSizeHeight(product, size);
      return height === size ? size : `${size} ${height}`;
    })
    .join(" · ");

  document.querySelector(".detail-rating").hidden = true;
  document.querySelector(".detail-highlights").hidden = false;
  document.querySelector(".detail-highlights").innerHTML = `
    <div><span aria-hidden="true">✦</span><span>${sizeSummary}</span></div>
    <div><span aria-hidden="true">✦</span><span>${collectionLabel} collection · soft plush character design.</span></div>
    <div><span aria-hidden="true">✦</span><span>Free delivery across India · secure Razorpay checkout.</span></div>
    <div><span aria-hidden="true">✦</span><span>7-day support for damaged, defective or incorrect items.</span></div>
  `;
  document.querySelector(".detail-accordion").innerHTML = `
    <details open>
      <summary>Product details</summary>
      <div class="detail-panel">
        <dl class="spec-list">
          <div><dt>Collection</dt><dd>${collectionLabel}</dd></div>
          <div><dt>Available sizes</dt><dd>${sizes.join(" · ")}</dd></div>
          <div><dt>Approx. height</dt><dd>${heightSummary}</dd></div>
          <div><dt>Price range</dt><dd>${priceRange}</dd></div>
        </dl>
      </div>
    </details>
    <details>
      <summary>Care &amp; safety</summary>
      <div class="detail-panel">
        <p>Surface-clean gently with a soft, damp cloth and mild soap, then air dry away from direct heat. Remove tags and packaging before giving this plush to a child, and check the seams and any sewn-in care label regularly. Small parts or embellishments can be a choking risk; supervise children under 3 and stop using the toy if a seam or part becomes loose.</p>
      </div>
    </details>
    <details>
      <summary>Delivery &amp; returns</summary>
      <div class="detail-panel">
        <p>Free delivery across India. We aim to dispatch within 1–2 business days, and most orders arrive within 5–9 business days after dispatch. If your plush arrives damaged, defective or incorrect, email <a href="mailto:support@plushstory.shop?subject=Order%20problem">support@plushstory.shop</a> within 7 days of delivery with your order number and photos or a short video. Read the full <a href="/shipping-returns">delivery and returns policy</a>.</p>
      </div>
    </details>
  `;

  const productImages = store.productImages(product);
  const photoLabel = (image, index) => {
    if (index === 0) return "Main photo";
    if (image.includes("-closeup.")) return "Close-up";
    if (image.includes("-styled.")) return "Styled view";
    return `Photo ${index + 1}`;
  };
  document.querySelector("#detail-art").style.background = "#f7f3ee";
  document.querySelector("#detail-art").innerHTML = `
    <span class="decor decor-one" aria-hidden="true">✦</span>
    <span class="decor decor-two" aria-hidden="true">✧</span>
    ${store.productVisual(product, "eager", "full", productImages[0])}
    ${productImages.length > 1 ? `<span class="detail-photo-count" id="detail-photo-count" aria-hidden="true">1 / ${productImages.length}</span>` : ""}
  `;
  const thumbnails = document.querySelector("#detail-thumbnails");
  const mainImage = document.querySelector("#detail-art .product-image");
  const photoCount = document.querySelector("#detail-photo-count");
  thumbnails.hidden = productImages.length < 2;
  const updateThumbnailColumns = () => {
    const visibleThumbnails = thumbnails.querySelectorAll(".detail-thumbnail:not([hidden])").length;
    if (!visibleThumbnails) {
      thumbnails.hidden = true;
      return;
    }
    const columns = visibleThumbnails === 4 ? 2 : Math.min(visibleThumbnails, 3);
    thumbnails.style.gridTemplateColumns = `repeat(${columns}, minmax(0, 1fr))`;
  };
  thumbnails.innerHTML = productImages.map((image, index) => {
    const label = photoLabel(image, index);
    const thumbnailImage = store.galleryThumbnail(image);
    return `
      <button class="detail-thumbnail${index === 0 ? " is-active" : ""}" type="button" data-photo-index="${index}" title="${label}" aria-label="View ${label.toLowerCase()} of ${product.name}" aria-pressed="${index === 0}">
        <img src="${thumbnailImage}" alt="" loading="lazy" decoding="async" width="240" height="240">
      </button>
    `;
  }).join("");
  thumbnails.addEventListener("click", (event) => {
    const button = event.target.closest("[data-photo-index]");
    if (!button) return;
    const index = Number(button.dataset.photoIndex);
    mainImage.src = productImages[index];
    mainImage.alt = `${product.name} — ${photoLabel(productImages[index], index)}`;
    if (photoCount) photoCount.textContent = `${index + 1} / ${productImages.length}`;
    thumbnails.querySelectorAll(".detail-thumbnail").forEach((thumbnail) => {
      const isActive = thumbnail === button;
      thumbnail.classList.toggle("is-active", isActive);
      thumbnail.setAttribute("aria-pressed", String(isActive));
    });
  });
  thumbnails.querySelectorAll(".detail-thumbnail img").forEach((image) => {
    image.addEventListener("error", () => {
      image.closest(".detail-thumbnail").hidden = true;
      updateThumbnailColumns();
    }, { once: true });
  });
  updateThumbnailColumns();
  updateMetaTags(product);

  const updateQuantity = () => {
    document.querySelector("#detail-quantity").textContent = quantity;
    updateSelectedSizePrice();
  };

  const handleAddToBag = (event) => {
    if (!addProductToBag()) return;
    const size = document.querySelector('input[name="product-size"]:checked').value;
    document.querySelector("#detail-feedback").textContent = `${quantity} ${product.name} (${size}) added to your bag.`;
    showToast("Added to your bag.", { action: true, returnFocus: event?.currentTarget });
  };

  const handleBuyNow = () => {
    if (!addProductToBag()) return;
    window.location.href = "/checkout";
  };

  document.querySelector("#quantity-minus").addEventListener("click", () => {
    quantity = Math.max(1, quantity - 1);
    updateQuantity();
  });
  document.querySelector("#quantity-plus").addEventListener("click", () => {
    quantity += 1;
    updateQuantity();
  });
  document.querySelector("#add-to-bag").addEventListener("click", handleAddToBag);
  document.querySelector("#buy-now").addEventListener("click", handleBuyNow);
  document.querySelector("#mobile-add-to-bag").addEventListener("click", handleAddToBag);
  document.querySelector("#mobile-buy-now").addEventListener("click", handleBuyNow);

  if (mobileBar) {
    mobileBar.hidden = false;
    updateSelectedSizePrice();
  }

  const selectedSize = document.querySelector('input[name="product-size"]:checked').value;
  trackEvent("ViewContent", {
    content_type: "product",
    content_ids: [product.id],
    content_name: product.name,
    content_category: product.caption,
    value: store.productPrice(product, selectedSize),
    currency: "INR",
  });

  renderRecommendations();
}

initializeProduct();
