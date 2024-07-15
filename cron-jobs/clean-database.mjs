import pool from "../db.mjs";
import dotenv from 'dotenv';
dotenv.config();

const cleanDatabase = async () => {
    let client = await pool.connect();
    try {
        await client.query(`DELETE FROM notifications;`);
    } catch (error) {
        console.error("Database query error:", error);
        return { error: "Database query failed." };
    } finally {
        client.release();
    }

    client = await pool.connect();
    try {
        await client.query(`DELETE FROM otp;`);
    } catch (error) {
        console.error("Database query error:", error);
        return { error: "Database query failed." };
    } finally {
        client.release();
    }
}

export default cleanDatabase;