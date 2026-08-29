import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from './_lib/db.js';
import { verifyAdminRequest } from './_lib/auth.js';
import { handlePreflight, methodNotAllowed, serverError, unauthorized } from './_lib/http.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handlePreflight(req, res)) return;

  try {
    if (req.method === 'GET') {
      const rows = await sql`SELECT * FROM home_profile WHERE id = 1`;
      return res.status(200).json(rows[0] || null);
    }

    if (req.method === 'PUT') {
      const admin = verifyAdminRequest(req);
      if (!admin) return unauthorized(res);

      const {
        greeting, full_name, role_title, interest_line, summary,
        resume_url, github_url, linkedin_url, email, rotating_skills,
      } = req.body || {};

      const rows = await sql`
        UPDATE home_profile SET
          greeting = COALESCE(${greeting}, greeting),
          full_name = COALESCE(${full_name}, full_name),
          role_title = COALESCE(${role_title}, role_title),
          interest_line = COALESCE(${interest_line}, interest_line),
          summary = COALESCE(${summary}, summary),
          resume_url = COALESCE(${resume_url}, resume_url),
          github_url = COALESCE(${github_url}, github_url),
          linkedin_url = COALESCE(${linkedin_url}, linkedin_url),
          email = COALESCE(${email}, email),
          rotating_skills = COALESCE(${rotating_skills}, rotating_skills),
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
