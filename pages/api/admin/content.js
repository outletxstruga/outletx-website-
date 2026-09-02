import { requireAdmin } from '../../../lib/adminAuth';
import { getDatabase } from '../../../lib/supabase';
import { getContent, validateContent } from '../../../lib/store';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (!requireAdmin(req, res)) return;
  if (!['GET', 'PUT'].includes(req.method)) return res.status(405).json({ error: 'Method not allowed' });
  try {
    const current = await getContent();
    if (req.method === 'GET') return res.status(200).json(current);
    if (!Number.isInteger(req.body?._revision) || req.body._revision !== current._revision) return res.status(409).json({ error: 'Store content changed. Reload this page before saving.' });
    let content;
    try { content = validateContent({ ...current, ...req.body }); }
    catch (error) { return res.status(400).json({ error: error.message }); }
    const { data, error } = await getDatabase().from('outletx_content').update({ data: content, revision: current._revision + 1 }).eq('id', 'main').eq('revision', current._revision).select('revision');
    if (error) throw error;
    if (!data.length) return res.status(409).json({ error: 'Store content changed. Reload before saving.' });
    return res.status(200).json({ success: true, content: { ...content, _revision: data[0].revision } });
  } catch {
    return res.status(503).json({ error: 'Store content could not be saved or loaded. Please try again.' });
  }
}
