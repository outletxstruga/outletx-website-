import crypto from 'crypto';
import { createAdminSession } from '../../../lib/adminAuth';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password } = req.body;

  const expected = process.env.ADMIN_PASSWORD || '';
  const supplied = typeof password === 'string' ? password : '';
  const valid = expected.length > 0 && supplied.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(supplied), Buffer.from(expected));

  if (valid) {
    res.setHeader('Set-Cookie', createAdminSession());
    return res.status(200).json({ success: true });
  }

  return res.status(401).json({ error: 'Invalid password' });
}

