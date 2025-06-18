import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DB_URI
})

pool.query(`
    CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        flavor TEXT NOT NULL,
        category TEXT NOT NULL,
        image_url TEXT NOT NULL,
        image_id TEXT,
        weights JSONB NOT NULL,
        description TEXT NOT NULL,
        isveg BOOLEAN NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
    );
`);

export default pool;
