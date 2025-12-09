import mailgun from '../config/mailgun'


async function sendDailyEmail(user, subject, html) {
return mailgun.sendMail(user.email, subject, html);
}


module.exports = { sendDailyEmail };