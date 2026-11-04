const store = window.LittleWonderStore;
const productId = new URLSearchParams(window.location.search).get("id");
const product = store.products.find((item) => item.id === productId);
const toast = document.querySelector("#toast");
let quantity = 1;
let toastTimeout;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

function addProductToBag() {
  const cart = store.readCart();
  const size = document.querySelector('input[name="product-size"]:checked').value;
  const existing = cart.find((item) => item.id === product.id && item.size === size);
  if (existing) existing.quantity += quantity;
  else cart.push({ id: product.id, size, quantity });
  if (!store.saveCart(cart)) {
    showToast("Your bag could not be saved in this browser. Please check storage settings.");
    return false;
  }
  document.querySelector("#detail-cart-count").textContent = cart.reduce((total, item) => total + item.quantity, 0);
  return true;
}

function renderRecommendations() {
  const relatedProducts = store.products
    .filter((item) => item.id !== product.id)
    .sort((a, b) => Number(b.category === product.category) - Number(a.category === product.category) || (b.sizeRank || 0) - (a.sizeRank || 0))
    .slice(0, 3)
    .map((item) => `
      <a class="recommendation-card" href="product.html?id=${encodeURIComponent(item.id)}">
        <div class="recommendation-art" style="background:${item.color}">${store.productVisual(item, "lazy", "card")}</div>
        <span>${item.name}</span>
        <strong>From ${store.formatCurrency.format(store.productPrice(item, store.productSizesFor(item)[0]))}</strong>
      </a>
    `).join("");
  document.querySelector("#recommendation-grid").innerHTML = relatedProducts;
}

function initializeProduct() {
  if (!product) {
    document.querySelector("#product-detail").innerHTML = `
      <div class="product-unavailable">
        <span class="eyebrow">A LITTLE MIX-UP</span>
        <h1>We couldn't find that plush pal.</h1>
        <p>Have a look through the collection to find your new favorite.</p>
        <a class="button button-dark" href="index.html#shop">Browse the collection <span aria-hidden="true">→</span></a>
      </div>
    `;
    return;
  }

  document.title = `${product.name} — Little Wonder`;
  document.querySelector('meta[name="description"]').content = product.description;
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
    const selectedSize = document.querySelector('input[name="product-size"]:checked').value;
    document.querySelector("#detail-price").textContent = store.formatCurrency.format(store.productPrice(product, selectedSize));
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
    <div><span aria-hidden="true">✦</span><span>Delivery charges confirmed at checkout.</span></div>
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
        <p>Surface-clean gently with a soft, damp cloth and mild soap, then air dry away from direct heat. Remove tags and packaging before giving this plush to a child, and check the seams and any sewn-in care label regularly.</p>
      </div>
    </details>
    <details>
      <summary>Delivery &amp; returns</summary>
      <div class="detail-panel">
        <p>Delivery charges will be confirmed at checkout. Returns and exchanges follow the store's policy, so please confirm the details with us before placing an order.</p>
      </div>
    </details>
  `;
  const productImages = store.productImages(product);
  const photoLabel = (image, index) => {
    if (index === 0) return "Main photo";
    if (image.includes("-closeup.jpg")) return "Close-up";
    if (image.includes("-styled.jpg")) return "Styled view";
    return `Photo ${index + 1}`;
  };
  document.querySelector("#detail-art").style.background = product.color;
  document.querySelector("#detail-art").innerHTML = `
    <span class="decor decor-one" aria-hidden="true">✦</span>
    <span class="decor decor-two" aria-hidden="true">✧</span>
    ${store.productVisual(product, "eager")}
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
    const thumbnailImage = store.productImageVariant(image, 480);
    const thumbnailSources = [240, 360, 480]
      .map((width) => store.productImageVariant(image, width))
      .filter((source, sourceIndex, sources) => source !== image && sources.indexOf(source) === sourceIndex);
    const responsiveAttributes = thumbnailSources.length
      ? ` srcset="${thumbnailSources.map((source, sourceIndex) => `${source} ${[240, 360, 480][sourceIndex]}w`).join(", ")}" sizes="140px"`
      : "";
    return `
      <button class="detail-thumbnail${index === 0 ? " is-active" : ""}" type="button" data-photo-index="${index}" title="${label}" aria-label="View ${label.toLowerCase()} of ${product.name}" aria-pressed="${index === 0}">
        <img src="${thumbnailImage}"${responsiveAttributes} alt="" loading="lazy" decoding="async">
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
  document.querySelector("#detail-cart-count").textContent = store.readCart().reduce((total, item) => total + item.quantity, 0);
  document.querySelector("#current-year").textContent = new Date().getFullYear();
  document.querySelector("#quantity-minus").addEventListener("click", () => {
    quantity = Math.max(1, quantity - 1);
    document.querySelector("#detail-quantity").textContent = quantity;
  });
  document.querySelector("#quantity-plus").addEventListener("click", () => {
    quantity += 1;
    document.querySelector("#detail-quantity").textContent = quantity;
  });
  document.querySelector("#add-to-bag").addEventListener("click", () => {
    if (!addProductToBag()) return;
    const size = document.querySelector('input[name="product-size"]:checked').value;
    document.querySelector("#detail-feedback").textContent = `${quantity} ${product.name} (${size}) added to your bag.`;
    showToast("Added to your bag!");
  });
  document.querySelector("#buy-now").addEventListener("click", () => {
    if (!addProductToBag()) return;
    window.location.href = "checkout.html";
  });
  renderRecommendations();
}

initializeProduct();
