# viaSocket plan: Kora Bakehouse (approved, built)

Feature: prebuilt UI (https://viasocket.com/docs/embed.md), default config, section 4a
(the site's own code runs each automation the owners publish).

## Pages
- `/`       the shop (already live)
- `/admin`  setup page, behind the admin password (hashed, stored under DATA_DIR; changeable on the page)

## Who the viaSocket "user" is
One user id for the whole bakery: `kora-owners`. Rainy and Kashika share the admin page.

## Who picks what
| Thing | Who | When |
| --- | --- | --- |
| Which apps to connect (WhatsApp, Razorpay, Sheets, ...) | owners, on /admin | once, changeable any time |
| What happens on a new order (each automation's steps) | owners, on /admin | once per automation |
| Field mapping inside each step | owners, with a sample order for suggestions | once per automation |
| Order data (id, customer, items, total, method) | the site's code | every order |
| Signing the admin's embed token | the site's server (embed secret) | every /admin page load |
| AI | nobody: not used | - |

## Calls
- `viasocket.user('kora-owners').token()`  -> embed token for /admin (server route, password-gated)
- `viaSocket.mount(...)` on /admin, `dummy_payload` = sample order
- on `published` / `updated`: browser sends only `flow.id` to the server; server reads it with
  `user.listFlows()` and stores its webhook URL under DATA_DIR
- on `paused` / `deleted`: server stops calling / drops the record
- on every order: server POSTs the order to each stored, active automation URL

## Storage
Orders and stored automations move from memory to a file under DATA_DIR so they survive redeploys.

## Not tested from the build sandbox
Anything needing a real browser on /admin (rendering the box, publishing, pausing): the owner does one test run.

## As built
- Keys: pasted once on /admin ("viaSocket keys"), stored under DATA_DIR; env vars VIASOCKET_* are the fallback.
- `src/lib/automations.ts` (client, store, order targets), `src/components/admin/Automations.tsx` (the box + listener),
  `/api/admin/viasocket/token`, `/api/admin/viasocket/flows`, `/api/admin/test`.
- Orders and automations are JSON files under DATA_DIR.

## UNTESTED (needs a real browser on the deployed /admin)
- The screens rendering in the box; a publish reaching the listener; a pause reaching the listener;
  a real automation run receiving an order. Order mode stays "mock" until the owner has done this once.
