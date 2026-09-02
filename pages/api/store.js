import { getContent, getProducts, localPreviewOnly } from '../../lib/store';
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const [products, content] = await Promise.all([getProducts(), getContent()]);
    return res.status(200).json({ products, content, checkoutReady: !localPreviewOnly() });
  } catch { return res.status(503).json({ error: 'The shop is temporarily unavailable. Please try again shortly.' }); }
}
