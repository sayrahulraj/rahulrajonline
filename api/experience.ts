import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from './_lib/db';
import { verifyAdminRequest } from './_lib/auth';
import { handlePreflight, methodNotAllowed, serverError, unauthorized } from './_lib/http';

// GET    /api/experience                       -> companies with nested projects (public)
// POST   /api/experience { entity: 'company'|'project', ... }          (admin)
// PUT    /api/experience { entity, id, ... }                            (admin)
// DELETE /api/experience?entity=company|project&id=123                  (admin)
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handlePreflight(req, res)) return;

  try {
    if (req.method === 'GET') {
      const companies = await sql`SELECT * FROM experiences ORDER BY sort_order ASC, start_date DESC`;
      const projects = await sql`SELECT * FROM experience_projects ORDER BY sort_order ASC, id ASC`;
      const grouped = companies.map((c: any) => ({
        ...c,
        projects: projects.filter((p: any) => p.experience_id === c.id),
      }));
      return res.status(200).json(grouped);
    }

    const admin = verifyAdminRequest(req);
    if (!admin) return unauthorized(res);

    if (req.method === 'POST') {
      const body = req.body || {};
      if (body.entity === 'company') {
        const { company_name, role, start_date, end_date, domain, description, sort_order } = body;
        if (!company_name || !role || !start_date) {
          return res.status(400).json({ error: 'company_name, role and start_date are required.' });
        }
        const rows = await sql`
          INSERT INTO experiences (company_name, role, start_date, end_date, domain, description, sort_order)
          VALUES (${company_name}, ${role}, ${start_date}, ${end_date || null}, ${domain || null}, ${description || null}, ${sort_order || 0})
          RETURNING *
        `;
        return res.status(201).json(rows[0]);
      }
      if (body.entity === 'project') {
        const { experience_id, project_name, responsibilities, achievements, tech_stack, sort_order } = body;
        if (!experience_id || !project_name) {
          return res.status(400).json({ error: 'experience_id and project_name are required.' });
        }
        const rows = await sql`
          INSERT INTO experience_projects (experience_id, project_name, responsibilities, achievements, tech_stack, sort_order)
          VALUES (${experience_id}, ${project_name}, ${responsibilities || null}, ${achievements || null}, ${tech_stack || []}, ${sort_order || 0})
          RETURNING *
        `;
        return res.status(201).json(rows[0]);
      }
      return res.status(400).json({ error: "entity must be 'company' or 'project'." });
    }

    if (req.method === 'PUT') {
      const body = req.body || {};
      if (!body.id) return res.status(400).json({ error: 'id is required.' });
      if (body.entity === 'company') {
        const { id, company_name, role, start_date, end_date, domain, description, sort_order } = body;
        // end_date is intentionally nullable (a null means "currently working here"),
        // so it is only touched when the field is explicitly present in the request.
        const nextEndDate = Object.prototype.hasOwnProperty.call(body, 'end_date') ? (end_date || null) : null;
        const rows = Object.prototype.hasOwnProperty.call(body, 'end_date')
          ? await sql`
              UPDATE experiences SET
                company_name = COALESCE(${company_name}, company_name),
                role = COALESCE(${role}, role),
                start_date = COALESCE(${start_date}, start_date),
                end_date = ${nextEndDate},
                domain = COALESCE(${domain}, domain),
                description = COALESCE(${description}, description),
                sort_order = COALESCE(${sort_order}, sort_order)
              WHERE id = ${id} RETURNING *
            `
          : await sql`
              UPDATE experiences SET
                company_name = COALESCE(${company_name}, company_name),
                role = COALESCE(${role}, role),
                start_date = COALESCE(${start_date}, start_date),
                domain = COALESCE(${domain}, domain),
                description = COALESCE(${description}, description),
                sort_order = COALESCE(${sort_order}, sort_order)
              WHERE id = ${id} RETURNING *
            `;
        return res.status(200).json(rows[0]);
      }
      if (body.entity === 'project') {
        const { id, project_name, responsibilities, achievements, tech_stack, sort_order } = body;
        const rows = await sql`
          UPDATE experience_projects SET
            project_name = COALESCE(${project_name}, project_name),
            responsibilities = COALESCE(${responsibilities}, responsibilities),
            achievements = COALESCE(${achievements}, achievements),
            tech_stack = COALESCE(${tech_stack}, tech_stack),
            sort_order = COALESCE(${sort_order}, sort_order)
          WHERE id = ${id} RETURNING *
        `;
        return res.status(200).json(rows[0]);
      }
      return res.status(400).json({ error: "entity must be 'company' or 'project'." });
    }

    if (req.method === 'DELETE') {
      const entity = req.query.entity as string;
      const id = req.query.id as string;
      if (!id || !entity) return res.status(400).json({ error: 'entity and id are required.' });
      if (entity === 'company') {
        await sql`DELETE FROM experiences WHERE id = ${id}`;
      } else {
        await sql`DELETE FROM experience_projects WHERE id = ${id}`;
      }
      return res.status(204).end();
    }

    return methodNotAllowed(res, ['GET', 'POST', 'PUT', 'DELETE']);
  } catch (err) {
    return serverError(res, err);
  }
}
