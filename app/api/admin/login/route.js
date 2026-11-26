import { NextResponse } from 'next/server';
import { ADMIN_COOKIE, adminConfigured, adminCookieOptions, checkPassword, createSession } from '@/lib/auth.js';
import { rateLimit } from '@/lib/rateLimit.js';
import { json, clientIp } from '@/lib/http.js';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  if (!rateLimit(`login:${clientIp(request)}`, 10, 10 * 60 * 1000)) {
    return json({ error: 'Too many attempts. Try again in a few minutes.' }, 429);
  }
  if (!adminConfigured()) {
    return json({ error: 'Admin is not configured. Set ADMIN_PASSWORD (and SESSION_SECRET in production).' }, 503);
  }
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return json({ error: 'Invalid request.' }, 400);
  }
  if (!checkPassword(body && body.password)) return json({ error: 'Wrong password.' }, 401);

  const res = NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
  res.cookies.set(ADMIN_COOKIE, createSession(), adminCookieOptions);
  return res;
}
