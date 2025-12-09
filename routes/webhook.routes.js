import express, { Router } from 'express'
import stripe from '../config/stripe.js'
import pool from '../config/db.js'
import env from '../config/env.js'

export const createWebhookRouter = () => {
  const WebhookRouter = Router()

  // 🔥 IMPORTANTE:
  // Aquí NO uses express.json(), solo express.raw()
  WebhookRouter.post(
    '/stripe',
    express.raw({ type: 'application/json' }),
    async (req, res) => {
      const sig = req.headers['stripe-signature']
      let event

      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          sig,
          env.STRIPE_WEBHOOK_SECRET
        )
      } catch (err) {
        console.error('❌ Error verificando la firma del Webhook:', err.message)
        return res.status(400).send(`Webhook Error: ${err.message}`)
      }

      // ---------- EVENTOS ----------
      switch (event.type) {
        case 'checkout.session.completed':
          // Stripe enviará luego invoice.payment_succeeded
          break

        case 'invoice.payment_succeeded':
          try {
            const invoice = event.data.object
            const customerId = invoice.customer

            const [rows] = await pool.query(
              'SELECT * FROM users WHERE stripe_customer_id = ?',
              [customerId]
            )

            const user = rows[0]

            if (user) {
              const price = invoice.lines.data[0].price
              const period = invoice.lines.data[0].period

              await pool.query(
                `INSERT INTO subscriptions 
                  (user_id, stripe_subscription_id, plan, status, current_period_end)
                 VALUES (?, ?, ?, ?, ?)
                 ON DUPLICATE KEY UPDATE
                    status = VALUES(status),
                    current_period_end = VALUES(current_period_end)
                `,
                [
                  user.id,
                  invoice.subscription,
                  price.recurring.interval,
                  'active',
                  new Date(period.end * 1000)
                ]
              )

              await pool.query(
                'UPDATE users SET active = 1 WHERE id = ?',
                [user.id]
              )
            }
          } catch (err) {
            console.error('❌ Error en invoice.payment_succeeded:', err)
          }
          break

        case 'customer.subscription.deleted':
        case 'invoice.payment_failed':
          try {
            const payload = event.data.object

            const customerId =
              payload.customer ||
              payload.customer_id ||
              null

            const [rows] = await pool.query(
              'SELECT * FROM users WHERE stripe_customer_id = ?',
              [customerId]
            )
            const user = rows[0]

            if (user) {
              await pool.query(
                `UPDATE subscriptions 
                 SET status = 'canceled' 
                 WHERE stripe_subscription_id = ?`,
                [payload.subscription || payload.id]
              )

              await pool.query(
                'UPDATE users SET active = 0 WHERE id = ?',
                [user.id]
              )
            }
          } catch (err) {
            console.error('❌ Error en cancelación:', err)
          }
          break

        default:
        // Puedes activar esto para debug:
        // console.log(`ℹ Evento no manejado: ${event.type}`)
      }

      res.json({ received: true })
    }
  )

  return WebhookRouter
}
