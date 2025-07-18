import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

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
        isveg BOOLEAN NOT NULL ,
        created_at TIMESTAMP DEFAULT NOW()
    );
`);

pool.query(`CREATE TABLE IF NOT EXISTS customorders(
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone NUMERIC NOT NULL,
        instructions TEXT NULL,
        image_url TEXT,
        image_id TEXT 
    );
`);

pool.query(` CREATE TABLE IF NOT EXISTS ORDERS(
          order_id SERIAL PRIMARY KEY,
          customer_name TEXT NOT NULL,
          customer_phone TEXT NOT NULL,
          cart JSON,
          total NUMERIC,
          order_date DATE NOT NULL
         );
`);

export default pool;
