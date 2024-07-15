import { Router } from "express";
import sendReminderMail from "../cron-jobs/reminder-mail.mjs";

const router = Router();

router.get('/api/send-mail', async (request, response) => {
    try {
        const res = await sendReminderMail();

        const errors = res.filter(result => result?.error);
        if (errors.length > 0) {
            response.status(500).send({ message: 'Some emails failed to send.', errors });
        } else {
            response.status(200).send('Mails sent successfully!');
        }
    } catch (error) {
        console.error("Error in /api/send-mail route:", error);
        response.status(500).send({ message: 'An error occurred while sending emails.', error });
    }
});

export default router;
