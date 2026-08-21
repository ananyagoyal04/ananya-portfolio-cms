import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const COOKIE_NAME = 'ag_session';
const secretKey = () => new TextEncoder().encode(process.env.JWT_SECRET || 'dev-only-fallback-secret');

async function isValid(token) {
  if (!token) return false;
  try {
    await jwtVerify(token, secretKey());
    return true;
  } catch {
    return false;
  }
}

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(COOKIE_NAME)?.value;

  // Protect the admin dashboard (but not the login page itself)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const valid = await isValid(token);
    if (!valid) {
      const loginUrl = new URL('/admin/login', req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect write operations on the content API (reads stay public)
  if (
    pathname.startsWith('/api/skills') ||
    pathname.startsWith('/api/certificates') ||
    pathname.startsWith('/api/projects') ||
    pathname.startsWith('/api/education') ||
    pathname.startsWith('/api/profile')
  ) {
    if (req.method !== 'GET') {
      const valid = await isValid(token);
      if (!valid) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/skills', '/api/certificates', '/api/projects', '/api/education', '/api/profile']
};
