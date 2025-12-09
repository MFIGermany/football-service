import axios from 'axios'
import env from '../config/env'


async function getFixturesForDate(dateISO) {
// dateISO expected like '2025-12-06'
const url = `${env.FOOTBALL_API_URL}/fixtures?date=${dateISO}`;
const resp = await axios.get(url, { headers: { 'x-api-key': env.FOOTBALL_API_KEY } });
return resp.data; // adapt based on your API's shape
}


module.exports = { getFixturesForDate };