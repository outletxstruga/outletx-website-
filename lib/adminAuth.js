import crypto from 'crypto';

const COOKIE_NAME = 'outletx_admin_session';

function getSecret() {
  return process.env.ADMIN_PASSWORD || '';
}

function createSignature(value) {
  return crypto.createHmac('sha256', getSecret()).update(value).digest('hex');
}

export function createAdminSession() {
  const expires = Date.now() + 8 * 60 * 60 * 1000;
  const value = `${expires}.${createSignature(String(expires))}`;
  return `${COOKIE_NAME}=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=28800${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;
}

export function clearAdminSession() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;
}

export function isAdminRequest(req) {
  const cookieHeader = req.headers.cookie || '';
  const match = cookieHeader.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]+)`));
  if (!match || !getSecret()) return false;

  const [expires, signature] = decodeURIComponent(match[1]).split('.');
  if (!expires || !signature || Number(expires) < Date.now()) return false;

  const expected = createSignature(expires);
  if (signature.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

export function requireAdmin(req, res) {
  if (isAdminRequest(req)) return true;
  res.status(401).json({ error: 'Admin login required' });
  return false;
}
