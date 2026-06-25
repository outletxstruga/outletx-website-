import { put, list, del } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { blobs } = await list({ prefix: 'orders/' });
      const orders = [];
      for (const blob of blobs) {
        const response = await fetch(blob.url);
        const order = await response.json();
        orders.push(order);
      }
      orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.status(200).json(orders);
    } catch {
      return res.status(200).json([]);
    }
  }

  if (req.method === 'POST') {
    const order = {
      id: Date.now(),
      ...req.body,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    await put(`orders/${order.id}.json`, JSON.stringify(order), {
      access: 'public',
      contentType: 'application/json',
    });

    return res.status(200).json({ success: true, order });
  }

  if (req.method === 'PUT') {
    const { id, status } = req.body;
    try {
      const { blobs } = await list({ prefix: `orders/${id}` });
      if (blobs.length > 0) {
        const response = await fetch(blobs[0].url);
        const order = await response.json();
        order.status = status;
        await put(`orders/${id}.json`, JSON.stringify(order), {
          access: 'public',
          contentType: 'application/json',
        });
      }
    } catch {}
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}