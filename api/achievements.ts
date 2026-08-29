import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from './_lib/db';
import { verifyAdminRequest } from './_lib/auth';
import { handlePreflight, methodNotAllowed, serverError, unauthorized } from './_lib/http';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handlePreflight(req, res)) return;

  try {
    if (req.method === 'GET') {
      const rows = await sql`SELECT * FROM achievements ORDER BY sort_order ASC, id ASC`;
      return res.status(200).json(rows);
    }

    const admin = verifyAdminRequest(req);
    if (!admin) return unauthorized(res);

    if (req.method === 'POST') {
      const { title, description, year, sort_order } = req.body || {};
      if (!title) return res.status(400).json({ error: 'title is required.' });
      const rows = await sql`
        INSERT INTO achievements (title, description, year, sort_order)
        VALUES (${title}, ${description || null}, ${year || null}, ${sort_order || 0})
        RETURNING *
      `;
      return res.status(201).json(rows[0]);
    }

    if (req.method === 'PUT') {
      const { id, title, description, year, sort_order } = req.body || {};
      if (!id) return res.status(400).json({ error: 'id is required.' });
      const rows = await sql`
        UPDATE achievements SET
          title = COALESCE(${title}, title),
          description = COALESCE(${description}, description),
          year = COALESCE(${year}, year),
          sort_order = COALESCE(${sort_order}, sort_order)
        WHERE id = ${id}
        RETURNING *
      `;
      return res.status(200).json(rows[0]);
    }

    if (req.method === 'DELETE') {
      const id = req.query.id || (req.body || {}).id;
      if (!id) return res.status(400).json({ error: 'id is required.' });
      await sql`DELETE FROM achievements WHERE id = ${id}`;
      return res.status(204).end();
    }

    return methodNotAllowed(res, ['GET', 'POST', 'PUT', 'DELETE']);
  } catch (err) {
    return serverError(res, err);
  }
}
