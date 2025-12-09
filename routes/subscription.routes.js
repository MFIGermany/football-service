import { SubscriptionController } from '../controllers/subscription.controller.js'
import { Router } from 'express'

export const createSubscriptionRouter = () => {
  const SubscriptionRouter = Router()

  const subscriptionController = new SubscriptionController()

  // Aquí sí va el método correcto:
  SubscriptionRouter.post(
    '/checkout',
    subscriptionController.createCheckoutSession
  )

  return SubscriptionRouter
}
