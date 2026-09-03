// POST { password } -> 200 + Set-Cookie on success, 401 on a wrong password.
// The password lives only in the ADMIN_PASSWORD environment variable on
// Vercel — it is never sent to the browser in any form.
import { createSessionCookie, timingSafeStringEqual } from './_session.js';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    res.status(500).json({ error: 'ADMIN_PASSWORD is not configured on the server' });
    return;
  }

  const { password } = req.body || {};
  if (!timingSafeStringEqual(password, expected)) {
    res.status(401).json({ error: 'Incorrect password' });
    return;
  }

  res.setHeader('Set-Cookie', createSessionCookie());
  res.status(200).json({ ok: true });
}
