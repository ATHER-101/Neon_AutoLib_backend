import { Router } from "express";
import pool from "../db.mjs";

const router = Router();

// get user
router.get("/api/users", async (request, response) => {
    const { user_id } = request.query;
    const client = await pool.connect();
    try {
        const res = await client.query(`SELECT * FROM users WHERE id=$1;`, [user_id]);

        return response.status(200).send(res.rows[0]);
    } catch (error) {
        return response.status(500).send({ error: error.message });
    } finally {
        client.release();
    }
})

// search users
router.get('/api/search-users', async (request, response) => {
    const { search } = request.query;
    const { limit } = request.query;
    const { name } = request.query;
    const client = await pool.connect();
    try {
        const res = await client.query(
            `SELECT ${name ? `name` : `*`}
            FROM search_users($1)
            ${limit ? `LIMIT ${limit}` : ``};`,
            [search]);
        return response.status(200).send(res.rows);
    } catch (error) {
        return response.status(500).send({ error: error.message });
    } finally {
        client.release();
    }
});
    

// get recent genre books
router.get("/api/users/recent-genres", async (request, response) => {
    const { user_id } = request.query;
    const client = await pool.connect();
    try {
        const res = await client.query(`SELECT * FROM get_books_by_recent_genres($1);`, [user_id]);

        //formatting
        const booksByGenre = {};

        res.rows.forEach(book => {
            if (!booksByGenre[book.genre]) {
                booksByGenre[book.genre] = [];
            }
            booksByGenre[book.genre].push({
                id: book.id,
                title: book.title,
                cover_img: book.cover_img
            });
        });

        const formattedData = Object.keys(booksByGenre).map(genre => ({
            genre: genre,
            books: booksByGenre[genre]
        }));

        return response.status(200).send(formattedData);
    } catch (error) {
        return response.status(500).send({ error: error.message });
    } finally {
        client.release();
    }
})

export default router;