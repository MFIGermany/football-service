import formData from 'form-data'
import Mailgun from 'mailgun.js'
import env from '../config/env.js'

const mailgun = new Mailgun(formData)

console.log(env.MAILGUN_API_KEY)

const mg = mailgun.client({
    username: 'api',
    key: env.MAILGUN_API_KEY
})

export const sendEmail = async ({ to, subject, html }) => {
    try {
        const response = await mg.messages.create(env.MAILGUN_DOMAIN, {
            from: env.MAILGUN_FROM,
            to,
            subject,
            html
        })

        console.log('Email enviado ✔️', response)
        return response
    } catch (error) {
        console.error('Error enviando email ❌', error)
        throw error
    }
}
