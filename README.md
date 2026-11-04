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
- One hundred and fifty plush toys, including 124 additional supplier-sourced products
- Category filters generated from the products currently in the catalog
- Individual product pages with image galleries, descriptions, a product-details accordion (collection, sizes, heights, price range, care, and delivery notes), a size chart (Small: 2 ft, Medium: 3.5 ft, Large: 6 ft), quantity selection, and recommendations
- A checkout preview with an editable order summary and India delivery fields
- Size-specific product prices in the requested Small (₹200–₹300), Medium (₹349–₹549), and Large (₹599–₹799) ranges
- Launch-offer labels without fabricated discount percentages or crossed-out reference prices
- Shopping bag and checkout with size-aware prices and subtotals; delivery charges remain to be confirmed
- Bag contents saved in the current browser with `localStorage`
- Responsive layout and keyboard-accessible controls

## Before taking real orders

This is a frontend starter, not a complete commerce backend. Catalog data lives in `store.js` and `catalog-expansion.js`; checkout is a preview and does not submit or save customer details or place orders. Product prices are stable, varied sample retail prices within the requested size bands; verify product costs, margins, and market fit before accepting orders. Delivery charges are not yet set. Before launching, verify product descriptions and specifications, connect a secure commerce/payment provider and order-management backend, set real shipping, tax, return, privacy, and contact information, and test the full order flow. Never collect or store payment-card details directly in this static site.

The About, Support, Privacy, and Contact sections describe the current preview. Add real store contact details and confirm delivery, returns, privacy, and support policies before accepting orders.

Product names and descriptions use detailed retail copy based on the visible design and available supplier listing details; specifications not confirmed by those sources are omitted. The original 26 primary photos are stored in `assets/products/`; the 124 additional primary photos load from supplier image hosts. Product galleries show only distinct photos that could be verified. The storefront does not link to supplier product pages.
