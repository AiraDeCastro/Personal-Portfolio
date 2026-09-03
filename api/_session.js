// Shared helpers for the admin session cookie. Files prefixed with `_` are
// not turned into their own Vercel Functions — safe to import from the
// actual route handlers (admin-login.js, admin-check.js, admin-logout.js).
import crypto from 'node:crypto';

export const COOKIE_NAME = 'admin_session';
const SESSION_HOURS = 12;

function sign(expiry) {
  const secret = process.env.ADMIN_PASSWORD || '';
  return crypto.createHmac('sha256', secret).update(String(expiry)).digest('hex');
}

export function createSessionCookie() {
  const expiry = Date.now() + SESSION_HOURS * 60 * 60 * 1000;
  const value = `${expiry}.${sign(expiry)}`;
  return `${COOKIE_NAME}=${value}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_HOURS * 60 * 60}`;
}

export function clearSessionCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
}

export function parseCookies(header) {
  const out = {};
  (header || '').split(';').forEach((pair) => {
    const idx = pair.indexOf('=');
    if (idx === -1) return;
    out[pair.slice(0, idx).trim()] = decodeURIComponent(pair.slice(idx + 1).trim());
  });
  return out;
}

export function isValidSession(cookieHeader) {
  const raw = parseCookies(cookieHeader)[COOKIE_NAME];
  if (!raw) return false;

  const [expiryStr, signature] = raw.split('.');
  const expiry = Number(expiryStr);
  if (!expiry || !signature || Date.now() > expiry) return false;

  const expected = Buffer.from(sign(expiry));
  const actual = Buffer.from(signature);
  return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
}

export function timingSafeStringEqual(a, b) {
  const bufA = Buffer.from(String(a ?? ''));
  const bufB = Buffer.from(String(b ?? ''));
  return bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB);
}
