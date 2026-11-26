import crypto from 'crypto';

const secret = () => process.env.SESSION_SECRET || 'dev-only-secret-change-me';
const hmac = (body) => crypto.createHmac('sha256', secret()).update(body).digest('base64url');

export function signToken(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${body}.${hmac(body)}`;
}

export function verifyToken(token) {
  if (typeof token !== 'string' || !token.includes('.')) return null;
  const [body, sig] = token.split('.');
  const a = Buffer.from(sig || '');
  const b = Buffer.from(hmac(body));
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString());
    return payload.exp && payload.exp > Date.now() ? payload : null;
  } catch (e) {
    return null;
  }
}

export function safeEqual(x, y) {
  const a = crypto.createHash('sha256').update(String(x)).digest();
  const b = crypto.createHash('sha256').update(String(y)).digest();
  return crypto.timingSafeEqual(a, b);
}
