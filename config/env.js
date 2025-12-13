import dotenv from 'dotenv'

dotenv.config({ path: './.env' })

const env = {
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME,
    DB_PORT: process.env.DB_PORT || 3306,


    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    STRIPE_PRICE_MONTHLY: process.env.STRIPE_PRICE_MONTHLY,
    STRIPE_PRICE_YEARLY: process.env.STRIPE_PRICE_YEARLY,


    MAILGUN_API_KEY: process.env.MAILGUN_API_KEY,
    MAILGUN_DOMAIN: process.env.MAILGUN_DOMAIN,
    MAILGUN_FROM: process.env.MAILGUN_FROM,


    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    OPENAI_MODEL: process.env.OPENAI_MODEL || 'gpt-4o-mini',


    FOOTBALL_API_URL: process.env.FOOTBALL_API_URL,
    FOOTBALL_API_KEY: process.env.FOOTBALL_API_KEY,

    CHECKS:process.env.CHECKS,
    GMAIL_USER:process.env.GMAIL_USER,
    GMAIL_PASS:process.env.GMAIL_PASS,
    GMAIL_CLIENT_ID:process.env.GMAIL_CLIENT_ID,
    GMAIL_CLIENT_SECRET:process.env.GMAIL_CLIENT_SECRET,
    GMAIL_REFRESH_TOKEN:process.env.GMAIL_REFRESH_TOKEN,


    APP_BASE_URL: process.env.APP_BASE_URL || 'http://localhost:3002',
    CRON_SCHEDULE: process.env.CRON_SCHEDULE || '0 22 * * *'
}

export default env