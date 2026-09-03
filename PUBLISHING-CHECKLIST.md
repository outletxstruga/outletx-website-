# OutletX launch checklist

Do not accept real customer orders until every **Required before selling** item is complete.

## Permanent brand rules

- Use the same clean sans-serif font family as the main header throughout the storefront and admin area.
- Display the OUTLETX wordmark only on a white or black background.
- Keep OUTLET in black on white or white on black, with the X always red.

## Required before selling

- [ ] Decide and approve the real returns, exchanges, faulty-product and refund policy.
- [ ] Confirm the delivery area, courier and normal working-day estimate.
- [ ] Add the registered business name and approved public support/privacy email.
- [ ] Have the Privacy notice, Terms, Returns and Delivery pages reviewed for the actual business and applicable law.
- [ ] In Supabase SQL Editor, run `database/02-protect-existing-orders.sql` and confirm it succeeds.
- [ ] Configure and test `EMAIL_USER`, `EMAIL_APP_PASSWORD` and `ADMIN_EMAIL` in Vercel using a real test address. Verify received, shipped and delivered messages.
- [ ] Replace the temporary/simple admin password with a unique password of at least 16 characters. Keep it only in Vercel.
- [ ] Test adding a product image from the admin page.
- [ ] Create one test product/order, then remove or cancel it before launch.
- [ ] Confirm every real product has the correct category, audience, SKU, colour, photos, price and size stock.
- [ ] Decide which countries/areas may order and prevent unsupported locations at checkout.
- [ ] Test the final production URL on iPhone/Safari and Android/Chrome.
- [ ] Connect Google Search Console and submit `https://outletx-website.vercel.app/sitemap.xml`.
- [ ] Decide whether Google Analytics should stay. If yes, verify consent mode and ecommerce events in GA DebugView.
- [ ] Add Meta Pixel only if OutletX creates its own Pixel ID and approves advertising tracking; keep it behind consent.
- [ ] Add an atomic stock reservation/decrement database function before a high-traffic campaign.
- [ ] Add login rate protection in Vercel Firewall before sharing the admin address widely.

## Already implemented

- [x] Cash-on-delivery checkout with server-side price, size and stock validation.
- [x] Duplicate-order retry protection and an on-screen order reference.
- [x] Order-received, shipped and delivered email templates.
- [x] One complete customer and admin email per order, including multi-item orders.
- [x] Products/content/orders stored server-side in Supabase; customer order data is not in the public catalogue.
- [x] Product images stored in the dedicated public product-image bucket.
- [x] English, Macedonian and Albanian storefront controls and core shopping flow.
- [x] Consent choice before Google Analytics loads; no Meta Pixel installed.
- [x] Canonical metadata, Open Graph text, sitemap, robots rules and product structured data.
- [x] Mobile catalogue filters, size selection, saved bag and responsive checkout.
- [x] New Help, Size guide, Delivery, Returns, Privacy and Terms pages.
- [x] Admin orders, customers and analytics count a multi-item checkout as one order.
