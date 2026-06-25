import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return res.status(200).json([]);
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    const order = {
      id: Date.now(),
      product_name: req.body.product?.name || '',
      product_brand: req.body.product?.brand || '',
      product_sku: req.body.product?.sku || '',
      product_price: req.body.product?.price || 0,
      size: req.body.size || '',
      quantity: req.body.quantity || 1,
      total: req.body.total || 0,
      customer_name: req.body.customerInfo?.fullName || '',
      customer_phone: req.body.customerInfo?.phone || '',
      customer_email: req.body.customerInfo?.email || '',
      customer_city: req.body.customerInfo?.city || '',
      customer_address: req.body.customerInfo?.address || '',
      card_last4: req.body.cardLast4 || '',
      status: 'pending',
    };

    const { error } = await supabase.from('orders').insert([order]);
    if (error) return res.status(200).json({ success: true, order });
    return res.status(200).json({ success: true, order });
  }

  if (req.method === 'PUT') {
    const { id, status } = req.body;
    await supabase.from('orders').update({ status }).eq('id', id);
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}