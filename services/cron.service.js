import cron from 'node-cron'
import env from '../config/env'
import pool from '../config/db'
import football from './football.service'
import template from './template.service'
import emailService from './email.service'
import dayjs from 'dayjs'


function start() {
const schedule = env.CRON_SCHEDULE; // '0 22 * * *'
cron.schedule(schedule, async () => {
console.log('Cron job running: building and sending daily emails');
try {
// compute tomorrow date
const tomorrow = dayjs().add(1, 'day').format('YYYY-MM-DD');


// get subscribed users
const [users] = await pool.query('SELECT * FROM users WHERE active = 1');
for (const user of users) {
const fixtures = await football.getFixturesForDate(tomorrow);
const html = await template.buildDailyEmailHtml(fixtures, user);
await emailService.sendDailyEmail(user, `Cartelera para ${tomorrow}`, html);
console.log(`Sent email to ${user.email}`);
}
} catch (err) {
console.error('Error in cron job', err);
}
});
}


module.exports = { start };