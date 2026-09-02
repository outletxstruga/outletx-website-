import { getContent } from '../../lib/store';
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  try { return res.status(200).json(await getContent()); }
  catch { return res.status(503).json({ error: 'Store content is temporarily unavailable.' }); }
}
