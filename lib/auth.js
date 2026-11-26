import { cookies } from 'next/headers';
import { signToken, verifyToken, safeEqual } from './token.js';

export const ADMIN_COOKIE = 'ejaz_admin';
export const adminCookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: 60 * 60 * 12,
};

// In production both ADMIN_PASSWORD and SESSION_SECRET must be set, otherwise the admin stays locked.
export function adminConfigured() {
  if (!process.env.ADMIN_PASSWORD) return false;
  return process.env.NODE_ENV !== 'production' || !!process.env.SESSION_SECRET;
}

export function checkPassword(input) {
  return adminConfigured() && safeEqual(input || '', process.env.ADMIN_PASSWORD);
}

export function createSession() {
  return signToken({ admin: true, exp: Date.now() + 12 * 60 * 60 * 1000 });
}

export function isAdmin() {
  if (!adminConfigured()) return false;
  const token = cookies().get(ADMIN_COOKIE)?.value;
  const payload = verifyToken(token);
  return !!(payload && payload.admin);
}
