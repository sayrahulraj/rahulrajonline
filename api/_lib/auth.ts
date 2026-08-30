import jwt from 'jsonwebtoken';
import type { VercelRequest } from '@vercel/node';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-only-insecure-secret-change-me';

export interface AdminTokenPayload {
  username: string;
  sub: number;
}

export function signAdminToken(payload: AdminTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '12h' });
}

// checks the Authorization: Bearer header, returns the payload or null if
// it's missing/bad/expired
export function verifyAdminRequest(req: VercelRequest): AdminTokenPayload | null {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded === 'string' || !decoded.username) return null;
    return decoded as unknown as AdminTokenPayload;
  } catch {
    return null;
  }
}
