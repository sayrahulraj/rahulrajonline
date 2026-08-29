import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from './_lib/db';
import { verifyAdminRequest } from './_lib/auth';
import { handlePreflight, methodNotAllowed, serverError, unauthorized } from './_lib/http';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handlePreflight(req, res)) return;

  try {
    if (req.method === 'GET') {
      const [aboutRows, achievementRows] = await Promise.all([
        sql`SELECT * FROM about_me WHERE id = 1`,
        sql`SELECT * FROM achievements ORDER BY sort_order ASC, id ASC`,
      ]);
      return res.status(200).json({
        about: aboutRows[0] || null,
        achievements: achievementRows,
      });
    }

    if (req.method === 'PUT') {
      const admin = verifyAdminRequest(req);
      if (!admin) return unauthorized(res);

      const { passion_title, passion_text, journey_text } = req.body || {};
      const rows = await sql`
        UPDATE about_me SET
          passion_title = COALESCE(${passion_title}, passion_title),
          passion_text = COALESCE(${passion_text}, passion_text),
          journey_text = COALESCE(${journey_text}, journey_text),
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
