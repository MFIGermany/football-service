import { MatchesController } from '../controllers/matches.controller.js'
import { Router } from 'express'

export const createMatchesRouter = () => {
  const MatchesRouter = Router()

  const matchesController = new MatchesController()

  // Aquí sí va el método correcto:
  MatchesRouter.get(
    '/',
    matchesController.getMatches
  )

  return MatchesRouter
}
