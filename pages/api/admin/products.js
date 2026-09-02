import { requireAdmin } from '../../../lib/adminAuth';
import { getDatabase } from '../../../lib/supabase';
import { getProducts, validateProduct } from '../../../lib/store';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (!requireAdmin(req, res)) return;
  if (!['GET', 'POST', 'PUT', 'DELETE'].includes(req.method)) return res.status(405).json({ error: 'Method not allowed' });
  try {
    if (req.method === 'GET') return res.status(200).json(await getProducts());
    const database = getDatabase();
    const id = Number(req.body?.id);
    const revision = req.body?._revision;
    if (req.method !== 'POST' && (!Number.isSafeInteger(id) || !Number.isInteger(revision))) return res.status(400).json({ error: 'Reload the product before saving.' });
    let product;
    if (req.method !== 'DELETE') {
      try { product = validateProduct(req.body); }
      catch (error) { return res.status(400).json({ error: error.message }); }
    }
    const table = database.from('outletx_products');
    const query = req.method === 'POST' ? table.insert({ data: product }) :
      req.method === 'PUT' ? table.update({ data: product, revision: revision + 1 }).eq('id', id).eq('revision', revision) :
      table.delete().eq('id', id).eq('revision', revision);
    const { data, error } = await query.select('id');
    if (error) throw error;
    if (!data.length) return res.status(409).json({ error: 'This product changed in another window. Reload it before saving.' });
    return res.status(200).json({ success: true });
  } catch {
    return res.status(503).json({ error: 'Product storage is unavailable. No change was confirmed. Please try again.' });
  }
}
