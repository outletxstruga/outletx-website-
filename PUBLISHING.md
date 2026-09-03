# OutletX publishing — browser-only steps

Status: local code builds, but the cloud database setup and deployment still need to be completed and tested. Do not replace production until the preview checks below pass.

## 1. Set up the existing database

1. Open https://supabase.com/dashboard in your normal browser and sign in.
2. Select the existing OutletX project. Its project reference is qkkscxaenwgqrcpdqeyb. Do not create a different project.
3. Open SQL Editor, then a new query.
4. Open database/01-setup.sql from this folder in Notepad, copy its entire contents into the query, and run it.
5. It should say Success. If it reports an error, stop and send the error text, not passwords or keys.
6. This adds separate catalogue, content and new-order tables and a product-image bucket. It does not delete existing orders or overwrite previously seeded products.
7. Do NOT run database/02-protect-existing-orders.sql yet: the old live code still uses a public database key.

## 2. Connect Vercel privately

1. Open your existing OutletX project in Vercel.
2. Under Settings → Git, confirm the connected repository is outletxstruga/outletx-website-.
3. Open Settings → Environment Variables. Add these for BOTH Preview and Production:
   - SUPABASE_URL: https://qkkscxaenwgqrcpdqeyb.supabase.co
   - SUPABASE_SERVICE_ROLE_KEY: the existing service_role server key (or server secret key) from this Supabase project's API Keys settings.
   - ADMIN_PASSWORD: your admin password. Use a strong, unique password before opening the shop to customers.
4. Enter the key directly from Supabase into Vercel. Never put it in GitHub, a screenshot, chat, or any variable starting NEXT_PUBLIC_.
5. Email is optional. Without EMAIL_USER, EMAIL_APP_PASSWORD and ADMIN_EMAIL, orders still save but no emails are sent. Do not re-add the old exposed Gmail password.

## 3. Upload the new website to a preview branch

1. Extract the provided upload ZIP into its own folder.
2. Open https://github.com/outletxstruga/outletx-website- in your browser.
3. At the repository's top level, choose Add file → Upload files.
4. Drag the CONTENTS of the extracted folder into the upload area, not the enclosing folder or ZIP.
5. Existing same-path files are updated. Do not delete the repository or existing product images.
6. Check the list: package.json, pages, components, lib, context, data, styles and public should be at the top level. Never upload .env.local, .next, node_modules or .git.
7. Choose to create a NEW branch for the upload (for example codex/store-storage-fix) and open a pull request. Do not commit directly to main yet.
8. Vercel should create a Preview deployment from that branch. If it does not, stop and check the Vercel Git connection.
9. Wait for Ready, then open the Preview link.

## 4. Check the preview before publishing

The preview uses the real database, so any products or orders you save are real records. Do not enter another person's information as test data.

1. Confirm products, images and homepage slides load.
2. Visit /admin/login and sign in.
3. Check that existing orders still appear.
4. Make an intentional admin edit, refresh, and confirm it remains saved and is visible in the store.
5. Upload one intended product image and check it remains visible after refresh.
6. Place one clearly labelled test cash-on-delivery order using your own details. It must appear in Admin → Orders. Mark it cancelled; do not fulfil it.
7. Check that the total matches the bag and delivery is charged once.
8. If any step fails, do not merge the pull request. Send the error for investigation.

## 5. Publish to the existing address

1. Once the preview checks pass, merge the pull request into the Vercel project's configured production branch (usually main).
2. Vercel should start the Production deployment automatically. Wait for Ready.
3. Open https://outletx-website.vercel.app and verify the updated shop.
4. Immediately run database/02-protect-existing-orders.sql in the same Supabase SQL Editor. This prevents direct public access to old customer-order records; the new server still reads and updates them.
5. Recheck Admin → Orders after running it.
6. Do not roll back to the old public-key code after protecting the orders table. Ask for help with a forward fix instead.

## What is and is not complete

- New order lines are inserted together in one database operation. Failed saves do not return success.
- Retries with the same checkout identifier are checked against the saved payload to avoid duplicate orders.
- Product, homepage and settings changes are stored in Supabase, not the deployment filesystem.
- Image uploads use Supabase Storage; temporary processing files are cleaned up.
- Production refuses writes without its server database connection. Local preview without a key is read-only.
- Prices, requested quantities and delivery totals are checked by the server.
- Inventory is checked at order time, but is NOT automatically reserved or decremented. You still manage stock in the admin area. Concurrent overselling prevention and automatic cancellation restocking require a separate transactional inventory workflow.
- This is not a complete security audit or a load test. Anti-bot controls, stronger admin authentication/rate limiting, and database access verification remain important before a large public launch.
- Cloud persistence, image uploads and real checkout have NOT yet been verified until you complete the preview checks.

References:
- https://vercel.com/docs/git
- https://vercel.com/docs/environment-variables
- https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository
- https://supabase.com/docs/guides/storage/security/access-control
