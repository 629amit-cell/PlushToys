# Little Wonder

A lightweight, responsive plush-toy storefront built with plain HTML, CSS, and JavaScript. It has no build step or runtime dependencies.

## Run locally

Run a static file server from this folder:

```sh
python3 -m http.server 8000
```

Then visit `http://localhost:8000/#product-grid` to open directly at the product cards.

Keep the terminal running while you use the site. If the browser shows `ERR_CONNECTION_REFUSED`, the local server is not running or port 8000 is unavailable. Restart the command above from this folder, then reload the page.

## What's included

- Product browsing, category filters, search, biggest-first and name sorting
- Individual, detailed descriptions for every product
- Premium red-and-gold toy-shop styling with responsive product cards
- Responsive supplier-image variants sized for catalog cards; full-resolution photos remain on product detail pages
- About, support, privacy, and contact information sections
- One hundred and seventy-four plush toys, including 124 AliExpress-sourced products and 24 Amazon-sourced giant plushies
- A "Giant plush" collection filter for oversized teddy bears, body pillows, and large character plushies
- Category filters generated from the products currently in the catalog
- Individual product pages with aligned multi-photo galleries (supplier photos where available, plus locally generated close-up and styled views), descriptions, a product-details accordion (collection, sizes, heights, price range, care, and delivery notes), a size chart, quantity selection, and recommendations
- A checkout preview with an editable order summary and India delivery fields
- Size-specific product prices for most of the catalog in the requested Small (₹200–₹300), Medium (₹349–₹549), and Large (₹599–₹799) ranges; Amazon giant-plush additions use single-size retail prices set between ₹499 and ₹899
- Launch-offer labels without fabricated discount percentages or crossed-out reference prices
- Shopping bag and checkout with size-aware prices and subtotals; delivery charges remain to be confirmed
- Bag contents saved in the current browser with `localStorage`
- Responsive layout and keyboard-accessible controls

## Before taking real orders

This is a frontend starter, not a complete commerce backend. Catalog data lives in `store.js`, `catalog-expansion.js`, `catalog-amazon.js`, and `catalog-gallery.js`; checkout is a preview and does not submit or save customer details or place orders. Product prices are stable, varied sample retail prices within the requested size bands, except for the Amazon giant-plush additions, which use single-size retail prices set between ₹499 and ₹899. The original Amazon prices are retained in the `supplierPrice` field for reference. Verify current supplier prices, product costs, margins, dimensions, and market fit before accepting orders. Delivery charges are not yet set. Before launching, verify product descriptions and specifications, confirm that you have permission to resell each branded product and use its supplier images, connect a secure commerce/payment provider and order-management backend, set real shipping, tax, return, privacy, and contact information, and test the full order flow. Never collect or store payment-card details directly in this static site.

The About, Support, Privacy, and Contact sections describe the current preview. Add real store contact details and confirm delivery, returns, privacy, and support policies before accepting orders.

Product names and descriptions use detailed retail copy based on the visible design and available supplier listing details; specifications not confirmed by those sources are omitted. The original 26 primary photos are stored in `assets/products/`; the 124 AliExpress additional primary photos load from supplier image hosts; the 24 Amazon giant-plush photos are stored in `assets/products/amazon/`. Amazon product pages also use additional listing photos where available. Every product-detail gallery photo is normalized to a 900 × 900 canvas, with the product centered and given consistent margins. Supplier listing photos are downloaded and aligned locally, while close-up and styled views are generated from the main product photo and stored in `assets/products/gallery/`; replace the generated views with real multi-angle supplier photos before launch where possible. The storefront does not link to supplier product pages. Amazon listings and images are included as supplier references, not as proof of resale authorization.
