import { neon } from '@neondatabase/serverless';

// needs to be set in Vercel project settings — pooled Neon connection string
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  // not throwing here on purpose, otherwise the whole function crashes at
  // import time instead of just this one request returning a 500
  console.error('DATABASE_URL environment variable is not set.');
}

export const sql = neon(connectionString || '');
