import pg from "pg";
const { Pool } = pg;

// const pool = new Pool({
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   host: process.env.DB_HOST,
//   port: Number(process.env.DB_PORT),
//   database: process.env.DB_NAME,
// });

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
        isveg BOOLEAN NOT NULL
        created_at TIMESTAMP DEFAULT NOW()
    );
`);

export default pool;
