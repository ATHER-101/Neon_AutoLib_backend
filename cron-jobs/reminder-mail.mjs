import nodemailer from 'nodemailer';
import pool from "../db.mjs";
import dotenv from 'dotenv';
dotenv.config();

import mailtemplate from '../mail-template.mjs';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.ADMIN_EMAIL_ID,
        pass: process.env.GMAIL_APP_PASSWORD,
    }
});

const sendReminderMail = async () => {
    const days_ago = process.env.ISSUE_PERIOD;
    let due_issues;

    let client = await pool.connect();
    try {
        const res = await client.query(`SELECT * FROM get_issues_by_days_ago($1);`, [days_ago]);
        due_issues = res.rows;
    } catch (error) {
        console.error("Database query error:", error);
        return { error: "Database query failed." };
    } finally {
        client.release();
    }

    client = await pool.connect();
    try {
        if (due_issues.length > 0) {
            const values = [];
            const queryParts = due_issues.map((issue, index) => {
                const baseIndex = index * 3 + 1;
                values.push(issue.user_id, "Return Reminder", `This is a reminder to return the book "${issue.book_title}". It was issued on ${new Date(issue.issue_date).toDateString()} with return on ${new Date().toDateString()}.`);
                return `($${baseIndex}, $${baseIndex + 1}, $${baseIndex + 2})`;
            });

            const query = `INSERT INTO notifications(user_id, title, description) VALUES ${queryParts.join(", ")};`;
            await client.query(query, values);
        } else {
            console.log("No due issues to insert.");
        }
    } catch (error) {
        return { error: error.message };
    } finally {
        client.release();
    }


    const sendMailPromises = due_issues.map(issue => {
        const mailOptions = {
            from: {
                name: "AutoLib Admin",
                address: process.env.ADMIN_EMAIL_ID,
            },
            to: issue.user_email,
            subject: `Return Reminder for ${issue.book_title}`,
            html: mailtemplate(issue),
        };

        return transporter.sendMail(mailOptions)
            .catch(error => {
                console.error(`Failed to send email to ${issue.user_email}:`, error);
                return { error: `Failed to send email to ${issue.user_email}` };
            });
    });

    return Promise.all(sendMailPromises);
}

export default sendReminderMail;
