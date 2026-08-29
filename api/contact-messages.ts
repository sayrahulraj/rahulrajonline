import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from './_lib/db';
import { verifyAdminRequest } from './_lib/auth';
import { handlePreflight, methodNotAllowed, serverError, unauthorized } from './_lib/http';

// The actual email delivery happens client-side via EmailJS. This endpoint
// just keeps a durable record of every message submitted through the form.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handlePreflight(req, res)) return;

  try {
    if (req.method === 'POST') {
      const { name, email, subject, message } = req.body || {};
      const wordCount = (message || '').trim().split(/\s+/).filter(Boolean).length;

      if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: 'name, email, subject and message are all required.' });
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Please provide a valid email address.' });
      }
      if (wordCount < 200) {
        return res.status(400).json({ error: `Message must be at least 200 words (currently ${wordCount}).` });
      }

      const rows = await sql`
        INSERT INTO contact_messages (name, email, subject, message)
        VALUES (${name}, ${email}, ${subject}, ${message})
        RETURNING *
      `;
      return res.status(201).json(rows[0]);
    }

    if (req.method === 'GET') {
      const admin = verifyAdminRequest(req);
      if (!admin) return unauthorized(res);
      const rows = await sql`SELECT * FROM contact_messages ORDER BY created_at DESC`;
      return res.status(200).json(rows);
    }

    return methodNotAllowed(res, ['GET', 'POST']);
  } catch (err) {
    return serverError(res, err);
  }
}
