import type { VercelRequest, VercelResponse } from '@vercel/node';

export function applyCors(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

/** Call at the top of every handler. Returns true if the request was an
 * OPTIONS preflight and has already been responded to (caller should return). */
export function handlePreflight(req: VercelRequest, res: VercelResponse): boolean {
  applyCors(req, res);
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return true;
  }
  return false;
}

export function methodNotAllowed(res: VercelResponse, allowed: string[]) {
  res.setHeader('Allow', allowed.join(', '));
  res.status(405).json({ error: `Method not allowed. Use ${allowed.join(', ')}.` });
}

export function serverError(res: VercelResponse, err: unknown) {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong on the server.' });
}

export function unauthorized(res: VercelResponse) {
  res.status(401).json({ error: 'Invalid or missing credentials.' });
}
