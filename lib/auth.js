import { SignJWT, jwtVerify } from 'jose';

const COOKIE_NAME = 'ag_session';

const secretKey = () =>
  new TextEncoder().encode(
    process.env.JWT_SECRET || 'dev-only-fallback-secret'
  );

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

function serializeCookie(name, value, options = {}) {
  let cookie = `${name}=${encodeURIComponent(value)}`;

  if (options.maxAge !== undefined) {
    cookie += `; Max-Age=${options.maxAge}`;
  }

  if (options.path) {
    cookie += `; Path=${options.path}`;
  }

  if (options.httpOnly) {
    cookie += '; HttpOnly';
  }

  if (options.secure) {
    cookie += '; Secure';
  }

  if (options.sameSite) {
    cookie += `; SameSite=${options.sameSite}`;
  }

  return cookie;
}

export function setSessionCookie(res, token) {
  const cookie = serializeCookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  res.setHeader('Set-Cookie', cookie);
}

export function clearSessionCookie(res) {
  const cookie = serializeCookie(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    path: '/',
    maxAge: 0,
  });

  res.setHeader('Set-Cookie', cookie);
}

export function getTokenFromReq(req) {
  const header = req.headers.cookie || '';

  const cookies = {};

  header.split(';').forEach((part) => {
    const index = part.indexOf('=');

    if (index === -1) return;

    const key = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();

    cookies[key] = decodeURIComponent(value);
  });

  return cookies[COOKIE_NAME];
}

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