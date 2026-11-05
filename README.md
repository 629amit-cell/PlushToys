# Little Wonder

A fast, responsive plush-toy storefront built with plain HTML, CSS, and JavaScript, deployed on Cloudflare Workers with static assets and Razorpay checkout.

## What's included

- 174 plush products, including 124 AliExpress-sourced products and 24 Amazon-sourced giant plushies
- Category filters, search, biggest-first and name sorting, and a Giant plush collection
- Individual product pages with 3–6 aligned gallery photos, detailed descriptions, size charts, care notes, and recommendations
- Local 480 × 480 card images and 240 × 240 gallery thumbnails served from the same Cloudflare deployment
- Secure Razorpay checkout with server-side price recalculation, signature verification, and an optional webhook
- Optional Cloudflare D1 order records
- Responsive layout, keyboard-accessible controls, and locally saved bag contents

## Run locally

For the full checkout flow, install Wrangler and run the local dev server:

```sh
npm install
cp .dev.vars.example .dev.vars
# Edit .dev.vars and add your Razorpay test keys.
npm run dev
```

Then visit `http://localhost:8787/`. The dev server builds `dist/`, serves the static storefront, and exposes the API at `/api/*` through `worker/index.js`.

To preview only the static storefront, without payments:

```sh
python3 -m http.server 8000
```

The checkout will show “Secure payment unavailable” in that mode because there is no API server.

## Cloudflare Workers deployment

The site is a static storefront plus a small Worker. `wrangler.toml` points `main` at `worker/index.js`, which routes `/api/*` to the handlers in `functions/api/`, and uploads the contents of `dist/` as static assets. `npm run build` copies the public files into `dist/`.

### Git integration (Workers Builds)

1. Push the repository to GitHub.
2. In the Cloudflare dashboard, go to **Workers & Pages → Create application → Workers → Import a repository**.
3. Select this repository and the `main` branch.
4. Use these build settings:
   - **Build command:** `npm run build`
   - **Deploy command:** `npx wrangler deploy`
   - **Root directory:** `/`
5. Add the environment variables below in **Settings → Variables & Secrets** for production (and preview, if used).
6. Deploy. Add a custom domain if you have one; Razorpay production checkout should use HTTPS.

Do **not** set the deploy command to `npx wrangler pages deploy`. Workers Builds manages a Worker project, and its API token is scoped to Workers, not Pages.

### Wrangler deployment from your machine

```sh
npm install
npx wrangler login
npm run deploy
```

The first deployment will ask you to authenticate with Cloudflare.

### Environment variables

| Name | Required | Purpose |
| --- | --- | --- |
| `RAZORPAY_KEY_ID` | Yes | Public Razorpay key ID (`rzp_test_…` or `rzp_live_…`). |
| `RAZORPAY_KEY_SECRET` | Yes | Server-only Razorpay secret. Never expose this in frontend files. |
| `RAZORPAY_WEBHOOK_SECRET` | Recommended | Secret entered when creating the Razorpay webhook. |
| `SHIPPING_FEE_INR` | No | Flat delivery fee in whole rupees. Defaults to `0` (free delivery). |

Locally, these go in `.dev.vars`. In Cloudflare, add them under **Settings → Variables & Secrets**. Do not commit `.dev.vars`.

### Optional D1 order records

D1 is not required for payments, but it is recommended so orders can be searched and fulfilled from your own database. Without D1, the order number and delivery address are still attached to the Razorpay order notes.

```sh
npx wrangler d1 create little-wonder-orders
```

Copy the printed `database_id` into the commented D1 binding in `wrangler.toml`, then apply the migration:

```sh
npx wrangler d1 execute little-wonder-orders --remote --file=./migrations/0001_orders.sql
```

For local D1 testing, run the same command with `--local`.

### Razorpay setup

1. Create a Razorpay account and complete the required KYC.
2. Start in **Test mode** and copy the test key ID and secret into `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`.
3. Make sure payment auto-capture is enabled in **Account & Settings → Payment Capture** (it is the Razorpay default).
4. Deploy the site, then create a webhook:
   - **URL:** `https://YOUR_DOMAIN/api/razorpay-webhook`
   - **Events:** `payment.captured` and `order.paid`
   - **Secret:** the same value as `RAZORPAY_WEBHOOK_SECRET`
5. Test the complete flow with Razorpay’s test payment methods.
6. Switch to live keys only after KYC, policies, pricing, and fulfilment are ready.

The browser receives only the public key ID and the Razorpay order ID. The secret and webhook secret stay in Cloudflare’s server environment. Every order total is recalculated on the server from `functions/_lib/catalog-data.js`; browser totals are never trusted.

### Payment API routes

| Route | Method | Purpose |
| --- | --- | --- |
| `/api/health` | GET | Deployment and configuration check. |
| `/api/checkout-config` | GET | Returns shipping fee and whether Razorpay is configured. |
| `/api/create-order` | POST | Validates the bag and customer details, then creates a Razorpay order. |
| `/api/verify-payment` | POST | Verifies the Razorpay signature, payment status, and amount. |
| `/api/razorpay-webhook` | POST | Verifies the webhook signature and records captured payments. |

## Performance

- Cloudflare serves the storefront and images from its global CDN.
- Catalogue cards use local 480 × 480 images instead of remote supplier URLs.
- Product-detail thumbnails use local 240 × 240 images; the full 900 × 900 photo opens only as the main image.
- `index.html` and `checkout.html` do not load the 40 KB gallery map; only product pages do.
- `_headers` gives long-lived immutable caching to versioned CSS/JS and a 30-day cache to image assets.
- `run_worker_first = ["/api/*"]` keeps static requests on the fast asset path and sends only API calls to the Worker.
- Razorpay Checkout is preconnected on the checkout page and loaded during idle time, so the page itself is not blocked by the payment SDK.

## Regenerating catalogue assets

After changing prices, sizes, or the product catalogue:

```sh
npm run generate:catalog
```

After changing gallery images:

```sh
npm run generate:assets
```

The asset script requires Python 3 and Pillow. It rebuilds `catalog-cards.js`, the 480 × 480 card images, and the 240 × 240 gallery thumbnails from `catalog-gallery.js`.

## Before launch

- Verify current supplier prices, costs, margins, dimensions, and product availability. The catalogue uses stable sample retail prices; Amazon giant plushies use single-size retail prices between ₹499 and ₹899, with the original Amazon reference prices kept in `supplierPrice`.
- Confirm that you have permission to resell each product and use its supplier images. Amazon and AliExpress listings are supplier references, not proof of resale authorization.
- Replace generated close-up and styled gallery views with real multi-angle supplier photos where possible.
- Set the real delivery fee in `SHIPPING_FEE_INR`, or leave it at `0` only if delivery is genuinely free.
- Publish real return, exchange, privacy, support, and contact details. The About, Support, Privacy, and Contact sections currently describe the technical setup and still need store-specific policies.
- Add a monitored support inbox and process for order fulfilment, cancellations, refunds, and payment-dispute handling.
- Test the complete checkout in Razorpay test mode before switching to live keys.

## Catalogue and image notes

- `store.js`, `catalog-expansion.js`, `catalog-amazon.js`, and `catalog-gallery.js` are the client catalogue sources.
- `functions/_lib/catalog-data.js` is generated from those files for server-side pricing.
- Original primary photos and aligned gallery photos are stored under `assets/products/`.
- Every gallery photo is a 900 × 900 cream canvas with the product centred and consistent margins.
- Card and thumbnail derivatives are stored in `assets/products/cards/` and `assets/products/thumbs/`.
- The shopping bag is saved in the browser with `localStorage`.
