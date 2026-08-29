import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from './_lib/db.js';
import { verifyAdminRequest } from './_lib/auth.js';
import { handlePreflight, methodNotAllowed, serverError, unauthorized } from './_lib/http.js';

// GET    /api/skills                -> categories with nested skills (public)
// POST   /api/skills  { entity: 'category' | 'skill', ... }       (admin)
// PUT    /api/skills  { entity, id, ... }                          (admin)
// DELETE /api/skills?entity=category|skill&id=123                 (admin)
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handlePreflight(req, res)) return;

  try {
    if (req.method === 'GET') {
      const categories = await sql`SELECT * FROM skill_categories ORDER BY sort_order ASC, id ASC`;
      const skills = await sql`SELECT * FROM skills ORDER BY sort_order ASC, id ASC`;
      const grouped = categories.map((cat: any) => ({
        ...cat,
        skills: skills.filter((s: any) => s.category_id === cat.id),
      }));
      return res.status(200).json(grouped);
    }

    const admin = verifyAdminRequest(req);
    if (!admin) return unauthorized(res);

    if (req.method === 'POST') {
      const { entity, name, category_id, proficiency, sort_order } = req.body || {};
      if (entity === 'category') {
        if (!name) return res.status(400).json({ error: 'name is required.' });
        const rows = await sql`
          INSERT INTO skill_categories (name, sort_order) VALUES (${name}, ${sort_order || 0}) RETURNING *
        `;
        return res.status(201).json(rows[0]);
      }
      if (entity === 'skill') {
        if (!name || !category_id) return res.status(400).json({ error: 'name and category_id are required.' });
        const rows = await sql`
          INSERT INTO skills (category_id, name, proficiency, sort_order)
          VALUES (${category_id}, ${name}, ${proficiency || 80}, ${sort_order || 0})
          RETURNING *
        `;
        return res.status(201).json(rows[0]);
      }
      return res.status(400).json({ error: "entity must be 'category' or 'skill'." });
    }

    if (req.method === 'PUT') {
      const { entity, id, name, category_id, proficiency, sort_order } = req.body || {};
      if (!id) return res.status(400).json({ error: 'id is required.' });
      if (entity === 'category') {
        const rows = await sql`
          UPDATE skill_categories SET
            name = COALESCE(${name}, name),
            sort_order = COALESCE(${sort_order}, sort_order)
          WHERE id = ${id} RETURNING *
        `;
        return res.status(200).json(rows[0]);
      }
      if (entity === 'skill') {
        const rows = await sql`
          UPDATE skills SET
            name = COALESCE(${name}, name),
            category_id = COALESCE(${category_id}, category_id),
            proficiency = COALESCE(${proficiency}, proficiency),
            sort_order = COALESCE(${sort_order}, sort_order)
          WHERE id = ${id} RETURNING *
        `;
        return res.status(200).json(rows[0]);
      }
      return res.status(400).json({ error: "entity must be 'category' or 'skill'." });
    }

    if (req.method === 'DELETE') {
      const entity = req.query.entity as string;
      const id = req.query.id as string;
      if (!id || !entity) return res.status(400).json({ error: 'entity and id are required.' });
      if (entity === 'category') {
        await sql`DELETE FROM skill_categories WHERE id = ${id}`;
      } else {
        await sql`DELETE FROM skills WHERE id = ${id}`;
      }
      return res.status(204).end();
    }

    return methodNotAllowed(res, ['GET', 'POST', 'PUT', 'DELETE']);
  } catch (err) {
    return serverError(res, err);
  }
}
