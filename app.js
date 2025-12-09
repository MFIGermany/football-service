import express, { json } from 'express'
import env from './config/env.js'
import cors from 'cors'
import { createSubscriptionRouter } from './routes/subscription.routes.js'
import { createWebhookRouter } from './routes/webhook.routes.js'
import { createMatchesRouter } from './routes/matches.routes.js'


export const createApp = () => {
    const app = express()

    app.use(json())
    app.use(cors())
    app.use('/api/subscription', createSubscriptionRouter())
    app.use('/api/webhook', createWebhookRouter())
    app.use('/api/matches', createMatchesRouter())
    
    app.get('/', (req, res) => res.send('Football Premium Service running'))
    
    const PORT = env.PORT ?? 3002

    app.listen(PORT, () => {
        console.log(`server listening on port http://localhost:${PORT}`)
    })

}

createApp()