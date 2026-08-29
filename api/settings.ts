import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from './_lib/db';
import { verifyAdminRequest } from './_lib/auth';
import { handlePreflight, methodNotAllowed, serverError, unauthorized } from './_lib/http';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handlePreflight(req, res)) return;

  try {
    if (req.method === 'GET') {
      const rows = await sql`SELECT * FROM site_settings WHERE id = 1`;
      return res.status(200).json(rows[0] || null);
    }

    if (req.method === 'PUT') {
      const admin = verifyAdminRequest(req);
      if (!admin) return unauthorized(res);
      const { resume_pdf_url } = req.body || {};
      const rows = await sql`
        UPDATE site_settings SET
          resume_pdf_url = COALESCE(${resume_pdf_url}, resume_pdf_url),
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
