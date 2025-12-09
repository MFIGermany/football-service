import OpenAI from 'openai'
import env from './env.js'

const client = new OpenAI({ apiKey: env.OPENAI_API_KEY });
module.exports = client;