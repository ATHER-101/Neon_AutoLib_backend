import pkg from 'pg';
const { Pool } = pkg;

import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    port: 5432,
    database: process.env.PG_DATABASE,
    ssl: {
        rejectUnauthorized: false,
    },
})

export default pool;

// postgresql://NeonAutoLib_owner:DpwBZs6ezUO3@ep-broad-voice-a1dzdzoi.ap-southeast-1.aws.neon.tech/NeonAutoLib?sslmode=require