export default async function handler(req, res) {
  // For now, store orders in memory (resets on redeploy)
  // We'll upgrade to a proper database later
  
  if (req.method === 'GET') {
    return res.status(200).json([]);
  }

  if (req.method === 'POST') {
    // Just acknowledge the order
    const order = {
      id: Date.now(),
      ...req.body,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    return res.status(200).json({ success: true, order });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}