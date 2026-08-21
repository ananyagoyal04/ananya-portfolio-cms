import bcrypt from 'bcryptjs';
import { signSession, setSessionCookie } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body || {};
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminHash = process.env.ADMIN_PASSWORD_HASH;

  if (!adminEmail || !adminHash) {
    return res.status(500).json({ error: 'Admin credentials are not configured on the server' });
  }
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  if (email.trim().toLowerCase() !== adminEmail.trim().toLowerCase()) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const ok = await bcrypt.compare(password, adminHash);
  if (!ok) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = await signSession({ sub: adminEmail, role: 'admin' });
  setSessionCookie(res, token);
  return res.status(200).json({ ok: true });
}
