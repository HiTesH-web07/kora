# Kōra Bakehouse website

Next.js 14 + TypeScript + Tailwind + Framer Motion + Lucide.

    npm install
    cp .env.example .env.local   # ORDER_MODE=mock works with no setup
    npm run dev

## Two pages
- `/` the website
- `/admin` the setup page: WhatsApp number, Instagram, location, hours, order mode (mock/live), viaSocket webhook, Razorpay secret, admin password. Saved settings are written to `DATA_DIR/settings.json` on Embarko, so they survive redeploys. Secrets never go to the browser; the API returns only a "set / not set" flag.

## Replace placeholders (nothing else needs touching)
- `src/data/products.ts`: SAMPLE menu, names, prices (INR). Replace photos in `public/images/` (same filenames).
- `src/data/site.ts`: story copy (placeholder), location, hours.
- WhatsApp number, Instagram, location and hours: set them in `/admin`, not in code. Env vars are only a fallback.

## Ordering flow
Cart (localStorage) -> checkout form (validated client + server) -> `POST /api/orders`
- Prices are recomputed server-side. Double submits are blocked (in-flight guard + idempotency key).
- `src/lib/viasocket.ts` forwards the order. **Placeholder**: webhook URL, auth header and payload shape are yours to supply; the response body is not parsed.
- `ORDER_MODE=mock` skips viaSocket and shows a "simulate payment" button on the confirmation screen.
- `POST /api/razorpay/webhook` verifies `X-Razorpay-Signature` (HMAC SHA256, `RAZORPAY_WEBHOOK_SECRET`) and is the ONLY thing that marks an order `paid`. It maps payments to orders via `reference_id` (payment links) or `notes.order_id`: create the Razorpay link in viaSocket with `reference_id = orderId`.
- `src/lib/orderStore.ts` is in-memory. Swap for a real database before launch.

## Hosting
Deployed on Embarko as `kora-bakehouse` (app id in `embarko.json`). Deploy again with the same command and the deploy token in `~/.embarko/credentials`.
