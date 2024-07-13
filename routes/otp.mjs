import { Router } from "express";
import pool from "../db.mjs";

const router = Router();

// generate issue otp
router.post("/api/issue-otp", async (request, response) => {
    const { user_id, user_name, book_id, book_title } = request.body;

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    const client = await pool.connect();
    try {
        await client.query(`INSERT INTO otp(user_id,book_id,otp)
            VALUES($1,$2,$3);`,
            [user_id, book_id, otp]);

        const title = `Issue Request by ${user_name}`;
        const description = `Consent Code for issueing ${book_title} by ${user_name} is [${otp}]`;

        try {
            await client.query(`INSERT INTO notifications(user_id,title,description)
            VALUES($1,$2,$3);`,
                ['admin', title, description]);
        } catch (error) {
            return response.status(500).send({ error: error.message });
        }

        return response.sendStatus(200);
    } catch (error) {
        return response.status(500).send({ error: error.message });
    } finally {
        client.release();
    }
})

// generate return otp
router.post("/api/return-otp", async (request, response) => {
    const { user_id, book_id, book_title } = request.body;

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    const client = await pool.connect();
    try {
        await client.query(`INSERT INTO otp(user_id,book_id,otp)
            VALUES($1,$2,$3);`,
            [user_id, book_id, otp]);

        const title = `Return Request for ${book_title}`;
        const description = `Consent Code for returning ${book_title} is [${otp}]`;

        try {
            await client.query(`INSERT INTO notifications(user_id,title,description)
            VALUES($1,$2,$3);`,
                [user_id, title, description]);
        } catch (error) {
            return response.status(500).send({ error: error.message });
        }

        return response.sendStatus(200);
    } catch (error) {
        return response.status(500).send({ error: error.message });
    } finally {
        client.release();
    }
})

// verify otp
router.post("/api/verify-otp", async (request, response) => {
    const { user_id, book_id, otp } = request.body;

    const client = await pool.connect();
    try {
        const res = await client.query(`SELECT * FROM otp
            WHERE user_id=$1 AND book_id=$2 AND otp=$3;`,
            [user_id, book_id, otp]);

        if (res.rows.length === 0) {
            return response.sendStatus(201);
        } else {
            try {
                await client.query(`DELETE FROM otp
                    WHERE user_id=$1 AND book_id=$2 AND otp=$3;`,
                    [user_id, book_id, otp]);
            } catch (error) {
                return response.status(500).send({ error: error.message });
            }
        }

        return response.sendStatus(200);
    } catch (error) {
        return response.status(500).send({ error: error.message });
    } finally {
        client.release();
    }
})

// cancel issue otp
router.delete("/api/issue-otp", async (request, response) => {
    const { user_id, user_name, book_id } = request.body;

    const client = await pool.connect();
    try {
        await client.query(`DELETE FROM otp
            WHERE user_id=$1 AND book_id=$2;`,
            [user_id, book_id]);

        const title = `Issue Request by ${user_name}`;

        try {
            await client.query(`DELETE FROM notifications
            WHERE user_id=$1 AND title=$2;`,
                ['admin', title]);
        } catch (error) {
            return response.status(500).send({ error: error.message });
        }

        return response.sendStatus(200);
    } catch (error) {
        return response.status(500).send({ error: error.message });
    } finally {
        client.release();
    }
})

// cancel return otp
router.delete("/api/return-otp", async (request, response) => {
    const { user_id, book_id, book_title } = request.body;

    const client = await pool.connect();
    try {
        await client.query(`DELETE FROM otp
            WHERE user_id=$1 AND book_id=$2;`,
            [user_id, book_id]);

        const title = `Return Request for ${book_title}`;

        try {
            await client.query(`DELETE FROM notifications
            WHERE user_id=$1 AND title=$2;`,
                [user_id, title]);
        } catch (error) {
            return response.status(500).send({ error: error.message });
        }

        return response.sendStatus(200);
    } catch (error) {
        return response.status(500).send({ error: error.message });
    } finally {
        client.release();
    }
})

export default router;