import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from './_lib/db.js';
import { verifyAdminRequest } from './_lib/auth.js';
import { handlePreflight, methodNotAllowed, serverError, unauthorized } from './_lib/http.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handlePreflight(req, res)) return;

  try {
    if (req.method === 'GET') {
      const rows = await sql`SELECT * FROM certifications ORDER BY sort_order ASC, completion_date DESC`;
      return res.status(200).json(rows);
    }

    const admin = verifyAdminRequest(req);
    if (!admin) return unauthorized(res);

    if (req.method === 'POST') {
      const { image_url, name, issuer, completion_date, expiry_date, certificate_url, sort_order } = req.body || {};
      if (!name || !issuer || !completion_date) {
        return res.status(400).json({ error: 'name, issuer and completion_date are required.' });
      }
      const rows = await sql`
        INSERT INTO certifications (image_url, name, issuer, completion_date, expiry_date, certificate_url, sort_order)
        VALUES (${image_url || null}, ${name}, ${issuer}, ${completion_date}, ${expiry_date || null}, ${certificate_url || null}, ${sort_order || 0})
        RETURNING *
      `;
      return res.status(201).json(rows[0]);
    }

    if (req.method === 'PUT') {
      const { id, image_url, name, issuer, completion_date, expiry_date, certificate_url, sort_order } = req.body || {};
      if (!id) return res.status(400).json({ error: 'id is required.' });
      const hasExpiry = Object.prototype.hasOwnProperty.call(req.body || {}, 'expiry_date');
      const rows = hasExpiry
        ? await sql`
            UPDATE certifications SET
              image_url = COALESCE(${image_url}, image_url),
              name = COALESCE(${name}, name),
              issuer = COALESCE(${issuer}, issuer),
              completion_date = COALESCE(${completion_date}, completion_date),
              expiry_date = ${expiry_date || null},
              certificate_url = COALESCE(${certificate_url}, certificate_url),
              sort_order = COALESCE(${sort_order}, sort_order)
            WHERE id = ${id} RETURNING *
          `
        : await sql`
            UPDATE certifications SET
              image_url = COALESCE(${image_url}, image_url),
              name = COALESCE(${name}, name),
              issuer = COALESCE(${issuer}, issuer),
              completion_date = COALESCE(${completion_date}, completion_date),
              certificate_url = COALESCE(${certificate_url}, certificate_url),
              sort_order = COALESCE(${sort_order}, sort_order)
            WHERE id = ${id} RETURNING *
          `;
      return res.status(200).json(rows[0]);
    }

    if (req.method === 'DELETE') {
      const id = req.query.id as string;
      if (!id) return res.status(400).json({ error: 'id is required.' });
      await sql`DELETE FROM certifications WHERE id = ${id}`;
      return res.status(204).end();
    }

    return methodNotAllowed(res, ['GET', 'POST', 'PUT', 'DELETE']);
  } catch (err) {
    return serverError(res, err);
  }
}
