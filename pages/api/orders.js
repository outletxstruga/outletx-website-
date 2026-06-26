import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('GET error:', error);
      return res.status(200).json([]);
    }
    return res.status(200).json(data || []);
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

    const { data, error } = await supabase.from('orders').insert([order]).select();
    
    if (error) {
      console.error('POST error:', error);
      return res.status(200).json({ success: true, order });
    }

    // Send confirmation to customer
    try {
      const { sendOrderEmail, sendAdminNotification } = await import('../../lib/email');
      await sendOrderEmail({ ...order, status: 'pending' });
      await sendAdminNotification({ ...order, status: 'pending' });
    } catch (err) {
      console.error('Email error:', err);
    }

    return res.status(200).json({ success: true, order: data[0] });
  }

  if (req.method === 'PUT') {
    const { id, status } = req.body;
    await supabase.from('orders').update({ status }).eq('id', id);
    
    if (status === 'shipped') {
      try {
        const { data } = await supabase.from('orders').select('*').eq('id', id).single();
        if (data && data.customer_email) {
          const { sendOrderEmail } = await import('../../lib/email');
          await sendOrderEmail(data);
        }
      } catch (err) {
        console.error('Email error:', err);
      }
    }
    
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
