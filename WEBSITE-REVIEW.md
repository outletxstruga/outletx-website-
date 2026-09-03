# OutletX website review and launch checklist

Status: the design and core shopping experience are complete. Items marked **Owner decision** need real OutletX business information and have deliberately not been invented.

## 1. Homepage — hero, sections, content and flow

- [x] Clear OutletX identity, current product photography and a direct route into the catalogue.
- [x] The old “up to 70%” promise is replaced at display time by the largest discount actually in stock.
- [x] Current-stock, customer-group, store-visit and current-brand sections create a clear shopping flow.
- [x] Empty and loading states are present; the homepage does not advertise products that are unavailable.
- [ ] **Owner decision:** approve final campaign wording and upload any future campaign photography through Admin → Homepage.

## 2. Products page — filters, sorting, layout and UX

- [x] Search; audience, brand, category, size, price and in-stock filters; removable filter chips and reset.
- [x] Featured, discount, newest and price sorting, plus pagination for a larger catalogue.
- [x] Product cards show real price, saving, sizes, stock state and customer group.
- [x] Mobile filter panel and responsive two-column layout; no horizontal overflow at 375 px.
- [ ] **Owner task:** confirm each real product has the correct category and audience so filters remain useful.

## 3. Single product page

- [x] Main image, thumbnails, zoom, price/saving, product code, details and related current-stock products.
- [x] Size selection is required before Add to bag becomes available; sold-out sizes are disabled.
- [x] Quantity is limited by the selected size’s current stock and the quantity already in the bag.
- [x] Size help, delivery price, free-delivery threshold, cash-on-delivery and local-store help are visible.
- [ ] **Owner task:** add accurate descriptions and several consistent, high-quality photographs to every product.
- [ ] **Owner decision:** provide documented authenticity information before adding an authenticity claim or badge.

## 4. Cart and checkout

- [x] Saved bag, editable quantities, unavailable-stock warnings and free-delivery progress.
- [x] Name, email, delivery phone, city, street/number and optional notes with browser autofill and limits.
- [x] Server rechecks product, price, size, quantity and total; a tampered browser cannot choose its own price.
- [x] A unique checkout reference makes a lost-response retry safe instead of creating a duplicate order.
- [x] Confirmation includes reference, items, total and print/save action. No card details are requested.
- [ ] **Owner decision:** confirm delivery area and normal delivery time, then restrict checkout to supported locations.
- [ ] **Scale improvement:** add an atomic database stock-reservation/decrement function before a high-traffic campaign to prevent two simultaneous customers buying the last unit.

## 5. About Us page

- [x] Professional, factual store presentation, Dua Mall location and current buying experience.
- [x] No invented founding date, team history or authenticity promise.
- [ ] **Owner decision:** add the real registered business identity and any true OutletX story you want customers to know.

## 6. Contact page

- [x] Dua Mall location, map/directions, opening hours and @OutletXstruga.
- [x] No public phone number, as requested.
- [ ] **Owner decision:** approve a public support/privacy email. A contact form should only be added with a real response process and privacy wording.

## 7. Header and navigation

- [x] Clear desktop categories, search, bag, Help and EN/MK/SQ language controls.
- [x] Complete mobile menu, keyboard Escape handling, outside-click closing and visible keyboard focus.
- [x] Every literal core-store translation used in the interface has Macedonian and Albanian coverage.
- [ ] **Future SEO option:** use separate language URLs and `hreflang` only if each language should rank separately in search.

## 8. Footer

- [x] Store details, hours, Instagram, shopping links, Help, policies and cookie settings.
- [x] Delivery, size help, cash-on-delivery and real-store trust links appear before the footer.
- [ ] **Owner decision:** add the registered business name and public contact email after approval.

## 9. Missing pages

- [x] Help and FAQ, Size guide, Shipping and payment, Returns and exchanges, Privacy notice and Terms of sale exist and are linked.
- [x] All are available in English, Macedonian and Albanian.
- [ ] **Owner decision:** approve the returns/exchanges/refund rules and the exact delivery promise before selling.

## 10. SEO

- [x] Unique titles/descriptions, canonical links, Open Graph text, Twitter text, favicon and theme colour.
- [x] Dynamic sitemap, robots rules, no-index protection for admin/checkout/cart and Product structured data.
- [x] Product pages are generated with product information in the initial HTML and refresh from server storage.
- [ ] **Owner task:** connect Google Search Console and submit `/sitemap.xml` after publication.
- [ ] **Optional:** commission a real OutletX social-sharing image before adding `og:image`; none was invented.

## 11. Performance

- [x] Product images use Next.js resizing, WebP/AVIF support, responsive sizes and eager loading only above the fold.
- [x] Products are server-rendered and cached with background refresh instead of blocking every page click.
- [x] Internal navigation uses fast client-side links and store data survives page changes.
- [x] External web fonts were removed, avoiding an unnecessary third-party request and render delay.
- [ ] **Before a large campaign:** run a production load test after the database stock transaction and rate limits are ready.

## 12. Mobile experience

- [x] Homepage, catalogue, product, bag, checkout, About, Contact and every policy/help page were checked at 375 px and desktop width.
- [x] No tested page has horizontal overflow; controls meet practical touch sizes and mobile purchase controls remain usable.
- [ ] **Owner task:** do one final production check on a real iPhone/Safari and Android/Chrome device.

## 13. Trust and credibility

- [x] Real physical location, opening hours, transparent delivery price, cash-on-delivery, size help and policy links.
- [x] No fake reviews, fake payment badges, fake ratings or unsupported authenticity claims were added.
- [ ] **Owner decision:** add only verifiable reviews, brand sourcing/authenticity proof and courier information.

## 14. Analytics and tracking

- [x] Google Analytics loads only after Accept analytics; refusal/withdrawal disables measurement and removes its first-party cookies.
- [x] Admin pages are excluded; product view, add-to-cart, checkout and purchase events are prepared.
- [x] No Meta Pixel is installed.
- [ ] **Owner task:** verify the Google Analytics stream and ecommerce events in DebugView.
- [ ] **Owner decision:** add Meta Pixel only after creating an OutletX Pixel ID and approving advertising consent wording.

## 15. Legal requirements

- [x] Equal Accept/Decline analytics choices, reopenable cookie settings and a three-language privacy draft.
- [x] The privacy draft identifies the information collected and the current Vercel, Supabase, Gmail and Analytics roles.
- [ ] **Required before selling:** add the registered business identity, approved support/privacy email, retention period and final returns, refund, delivery and complaint terms.
- [ ] **Required before selling:** obtain a local legal/privacy review. The current pages are careful drafts, not legal advice.

## Security, storage and order-email checks

- [x] Products, content and customer orders are stored server-side in Supabase, not browser storage or a public JSON file.
- [x] Database service credentials stay on the server; admin sessions use a signed, HttpOnly, Secure production cookie.
- [x] Product uploads are admin-only, limited to one 4 MB JPG/PNG/WebP and verified by file signature.
- [x] Received, shipped and delivered customer emails are prepared. Multi-item checkouts receive one complete order email.
- [x] Admin receives one complete new-order email, not a separate message for every line item.
- [x] Admin Overview, Orders, Customers and Analytics group multi-line checkouts as one order with correct totals.
- [ ] **Required before selling:** run `database/02-protect-existing-orders.sql` in the Supabase SQL Editor and verify the old `orders` table is private.
- [ ] **Required before selling:** replace the temporary admin password with a unique password of at least 16 characters and add login rate protection in Vercel Firewall.
- [ ] **Required before selling:** configure and test `EMAIL_USER`, `EMAIL_APP_PASSWORD` and `ADMIN_EMAIL` in Vercel.

## Verification completed

- 22 automated checks pass.
- The optimized production build completes successfully for all 24 routes.
- All customer-facing routes were checked at mobile and desktop widths without horizontal overflow.
- Size selection, disabled/enabled Add to bag, mobile navigation and all three interface languages were checked.
- No real customer order was submitted and no real email was sent during testing.
