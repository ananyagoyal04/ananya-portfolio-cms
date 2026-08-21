import { SignJWT, jwtVerify } from 'jose';
import { serialize, parse } from 'cookie';

const COOKIE_NAME = 'ag_session';
const secretKey = () => new TextEncoder().encode(process.env.JWT_SECRET || 'dev-only-fallback-secret');

export async function signSession(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey());
}

export async function verifySession(token) {
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return payload;
  } catch {
    return null;
  }
}

export function setSessionCookie(res, token) {
  const cookie = serialize(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24 * 7
  });
  res.setHeader('Set-Cookie', cookie);
}

export function clearSessionCookie(res) {
  const cookie = serialize(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0
  });
  res.setHeader('Set-Cookie', cookie);
}

export function getTokenFromReq(req) {
  const cookies = parse(req.headers.cookie || '');
  return cookies[COOKIE_NAME];
}

/** Use inside API routes to guard write operations. Returns true if authorized. */
export async function requireAdmin(req, res) {
  const token = getTokenFromReq(req);
  if (!token) {
    res.status(401).json({ error: 'Not authenticated' });
    return false;
  }
  const payload = await verifySession(token);
  if (!payload) {
    res.status(401).json({ error: 'Session expired, please log in again' });
    return false;
  }
  return true;
}

export const COOKIE = COOKIE_NAME;
