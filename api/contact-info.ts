import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from './_lib/db.js';
import { verifyAdminRequest } from './_lib/auth.js';
import { handlePreflight, methodNotAllowed, serverError, unauthorized } from './_lib/http.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handlePreflight(req, res)) return;

  try {
    if (req.method === 'GET') {
      const rows = await sql`SELECT * FROM contact_info WHERE id = 1`;
      return res.status(200).json(rows[0] || null);
    }

    if (req.method === 'PUT') {
      const admin = verifyAdminRequest(req);
      if (!admin) return unauthorized(res);

      const { email, phone, location, map_lat, map_lng, github_url, linkedin_url } = req.body || {};
      const rows = await sql`
        UPDATE contact_info SET
          email = COALESCE(${email}, email),
          phone = COALESCE(${phone}, phone),
          location = COALESCE(${location}, location),
          map_lat = COALESCE(${map_lat}, map_lat),
          map_lng = COALESCE(${map_lng}, map_lng),
          github_url = COALESCE(${github_url}, github_url),
          linkedin_url = COALESCE(${linkedin_url}, linkedin_url),
          updated_at = now()
        WHERE id = 1
        RETURNING *
      `;
      return res.status(200).json(rows[0]);
    }

    return methodNotAllowed(res, ['GET', 'PUT']);
  } catch (err) {
    return serverError(res, err);
  }
}
