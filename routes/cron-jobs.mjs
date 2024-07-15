import { Router } from "express";
import sendReminderMail from "../cron-jobs/reminder-mail.mjs";

const router = Router();

router.post('/api/send-mail', async (request, response) => {
    const { user, password } = request.body;
    if (user === process.env.CRON_JOB_USER && password === process.env.CRON_JOB_PASSWORD) {
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
    }else{
        response.status(404).send({message:"Not Authorised!"})
    }
});

export default router;
