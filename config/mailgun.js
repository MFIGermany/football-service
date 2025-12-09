import axios from 'axios'
import env from './env.js'


const mailgunApiKey = env.MAILGUN_API_KEY;
const domain = env.MAILGUN_DOMAIN;
const from = env.MAILGUN_FROM;


async function sendMail(to, subject, html) {
const url = `https://api.mailgun.net/v3/${domain}/messages`;
const form = new URLSearchParams();
form.append('from', from);
form.append('to', to);
form.append('subject', subject);
form.append('html', html);


const auth = { username: 'api', password: mailgunApiKey };


const resp = await axios.post(url, form.toString(), {
headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
auth
});


return resp.data;
}


module.exports = { sendMail };