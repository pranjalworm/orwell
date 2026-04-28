import pg from "pg";

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  user: "orwell",
  database: "orwell",
  password: process.env.DATABASE_PASSWORD,
  port: 5432,
});
