import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '../_lib/db.js.js.js';
import { signAdminToken } from '../_lib/auth.js.js';
import { handlePreflight, methodNotAllowed, serverError } from '../_lib/http.js.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handlePreflight(req, res)) return;
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);

  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    const rows = await sql`
      SELECT id, username, password FROM admin_users WHERE username = ${username} LIMIT 1
    `;

    const user = rows[0];
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const token = signAdminToken({ username: user.username, sub: user.id });
    return res.status(200).json({ token, username: user.username });
  } catch (err) {
    return serverError(res, err);
  }
}
