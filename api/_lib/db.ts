import { neon } from '@neondatabase/serverless';

// DATABASE_URL must be set in Vercel project settings (Neon connection string,
// e.g. postgresql://user:pass@ep-xxxx.neon.tech/neondb?sslmode=require)
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  // We don't throw at import time so the function can still return a clean
  // 500 with a helpful message instead of crashing the whole bundle.
  console.error('DATABASE_URL environment variable is not set.');
}

export const sql = neon(connectionString || '');
