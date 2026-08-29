import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from './_lib/db.js';
import { verifyAdminRequest } from './_lib/auth.js';
import { handlePreflight, methodNotAllowed, serverError, unauthorized } from './_lib/http.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handlePreflight(req, res)) return;

  try {
    if (req.method === 'GET') {
      const rows = await sql`SELECT * FROM projects ORDER BY sort_order ASC, id DESC`;
      return res.status(200).json(rows);
    }

    const admin = verifyAdminRequest(req);
    if (!admin) return unauthorized(res);

    if (req.method === 'POST') {
      const { photo_url, name, description, tech_stack, code_url, sort_order } = req.body || {};
      if (!name) return res.status(400).json({ error: 'name is required.' });
      const rows = await sql`
        INSERT INTO projects (photo_url, name, description, tech_stack, code_url, sort_order)
        VALUES (${photo_url || null}, ${name}, ${description || null}, ${tech_stack || []}, ${code_url || null}, ${sort_order || 0})
        RETURNING *
      `;
      return res.status(201).json(rows[0]);
    }

    if (req.method === 'PUT') {
      const { id, photo_url, name, description, tech_stack, code_url, sort_order } = req.body || {};
      if (!id) return res.status(400).json({ error: 'id is required.' });
      const rows = await sql`
        UPDATE projects SET
          photo_url = COALESCE(${photo_url}, photo_url),
          name = COALESCE(${name}, name),
          description = COALESCE(${description}, description),
          tech_stack = COALESCE(${tech_stack}, tech_stack),
          code_url = COALESCE(${code_url}, code_url),
          sort_order = COALESCE(${sort_order}, sort_order)
        WHERE id = ${id} RETURNING *
      `;
      return res.status(200).json(rows[0]);
    }

    if (req.method === 'DELETE') {
      const id = req.query.id as string;
      if (!id) return res.status(400).json({ error: 'id is required.' });
      await sql`DELETE FROM projects WHERE id = ${id}`;
      return res.status(204).end();
    }

    return methodNotAllowed(res, ['GET', 'POST', 'PUT', 'DELETE']);
  } catch (err) {
    return serverError(res, err);
  }
}
