import { Router } from "express";
import sendReminderMail from "../cron-jobs/reminder-mail.mjs";

const router = Router();

router.get('/api/send-mail',(request,response)=>{
    const res = sendReminderMail();
    if(res.error){
        response.status(500).send(res.error);
    }else{
        response.status(200).send('mails sent successfully!')
    }
})

export default router;