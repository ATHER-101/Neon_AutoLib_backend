import { Router } from "express";
import pool from "../db.mjs";

const router = Router();

// get notifications
router.get("/api/notifications", async (request, response) => {
    const { user_id } = request.query;
    const client = await pool.connect();
    try {
        const res = await client.query(`SELECT * FROM notifications WHERE user_id=$1;`, [user_id]);
        return response.status(200).send(res.rows);
    } catch (error) {
        return response.status(500).send({ error: error.message });
    } finally {
        client.release();
    }
})

// delete notification
router.delete("/api/notifications", async (request, response) => {
    const { user_id } = request.body;
    const { title } = request.body;
    const { description } = request.body;

    const client = await pool.connect();
    try {
        await client.query(`DELETE FROM notifications WHERE user_id=$1 AND title=$2 AND description=$3;`, [user_id,title,description]);
        return response.sendStatus(200);
    } catch (error) {
        return response.status(500).send({ error: error.message });
    } finally {
        client.release();
    }
})

export default router;