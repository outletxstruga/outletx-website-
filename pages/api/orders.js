import crypto from 'crypto';
import { getDatabase } from '../../lib/supabase';
import { getProducts, getContent } from '../../lib/store';
import { makeOrderRows } from '../../lib/orderValidation';
import { requireAdmin } from '../../lib/adminAuth';

export const config = { api: { bodyParser: { sizeLimit: '128kb' } } };

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (!['GET', 'POST', 'PUT'].includes(req.method)) return res.status(405).json({ error: 'Method not allowed' });
  if (req.method !== 'POST' && !requireAdmin(req, res)) return;
  try {
    const database = getDatabase();
    if (req.method === 'GET') {
      // Existing orders remain in their original table; do not erase or migrate customer data.
      const [current, legacy] = await Promise.all([
        database.from('outletx_order_lines').select('*').order('created_at', { ascending: false }),
        database.from('orders').select('*').order('created_at', { ascending: false })
      ]);
      if (current.error || legacy.error) throw new Error('Orders unavailable');
      return res.status(200).json([...current.data, ...legacy.data].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
    }
    if (req.method === 'PUT') {
      const { id, status } = req.body || {};
      if (!['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status) || !id) return res.status(400).json({ error: 'Choose a valid order status.' });
      const table = /^[0-9]+$/.test(String(id)) ? 'orders' : 'outletx_order_lines';
      const currentOrder = table === 'outletx_order_lines';
      const before = await database.from(table).select(currentOrder ? 'status,checkout_id' : 'status').eq('id', id).maybeSingle();
      if (before.error) throw before.error;
      if (!before.data) return res.status(404).json({ error: 'Order not found.' });
      if (before.data.status === status) return res.status(200).json({ success: true, unchanged: true });
      let change = database.from(table).update({ status });
      change = currentOrder ? change.eq('checkout_id', before.data.checkout_id) : change.eq('id', id);
      const { data, error } = await change.select('*');
      if (error) throw error;
      if (!data?.length) return res.status(404).json({ error: 'Order not found.' });
      let emailNotification = 'not-required';
      if (status === 'shipped' || status === 'delivered') {
        try { const { sendOrderEmail } = await import('../../lib/email'); const result=await sendOrderEmail(data);emailNotification=result.skipped?'not-configured':'sent'; }
        catch { emailNotification='failed';console.error('Order saved, but status email failed.'); }
      }
      return res.status(200).json({ success: true, emailNotification });
    }
    const body = req.body || {};
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(body.checkoutId || '')) return res.status(400).json({ error: 'Refresh checkout and try again.' });
    const fingerprint = crypto.createHash('sha256').update(JSON.stringify({ items: body.items, customerInfo: body.customerInfo, total: body.total })).digest('hex');
    const existing = await database.from('outletx_order_lines').select('id,request_hash').eq('checkout_id', body.checkoutId);
    if (existing.error) throw existing.error;
    const respondExisting = (rows) => {
      if (rows.some((row) => row.request_hash !== fingerprint)) return res.status(409).json({ error: 'This checkout was already received. Please contact the store before ordering again.' });
      return res.status(200).json({ success: true, orderIds: rows.map((row) => row.id) });
    };
    if (existing.data.length) return respondExisting(existing.data);
    const [products, content] = await Promise.all([getProducts(), getContent()]);
    let rows;
    try { rows = makeOrderRows(body, products, content.settings).map((row) => ({ ...row, request_hash: fingerprint })); }
    catch (error) { return res.status(400).json({ error: error.message }); }
    // One database INSERT for the whole bag: either every line is saved or none are.
    const saved = await database.from('outletx_order_lines').insert(rows).select('*');
    if (saved.error?.code === '23505') {
      const retry = await database.from('outletx_order_lines').select('id,request_hash').eq('checkout_id', body.checkoutId);
      if (retry.error || !retry.data.length) throw new Error('Order verification failed');
      return respondExisting(retry.data);
    }
    if (saved.error || saved.data?.length !== rows.length) throw new Error('Order save failed');
    let emailNotification = 'unknown';
    try {
      const { sendOrderEmail, sendAdminNotification } = await import('../../lib/email');
      const [customerResult,adminResult]=await Promise.allSettled([sendOrderEmail(saved.data),sendAdminNotification(saved.data)]);
      emailNotification=customerResult.status==='rejected'?'failed':customerResult.value.skipped?'not-configured':'sent';
      if(adminResult.status==='rejected')console.error('Order saved, but the admin email failed.');
    } catch { emailNotification='failed';console.error('Order saved, but notification email failed.'); }
    return res.status(201).json({ success: true, orderIds: saved.data.map((row) => row.id), emailNotification });
  } catch {
    return res.status(503).json({ error: 'We could not confirm your order or save the change. Please retry; your bag has been kept.' });
  }
}
