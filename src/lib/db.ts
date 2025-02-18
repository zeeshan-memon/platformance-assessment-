
import { Pool } from 'pg';

export const pool = new Pool({
  connectionstring: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});