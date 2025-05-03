import { Router } from 'express'
import { findAll, findOne, add, update, remove } from './actor.controller.js'
import { authAdmin, authenticate } from '../middlewares/auth.middleware.js'

export const actorRouter = Router()

actorRouter.get('/', findAll)
actorRouter.get('/:id', findOne)
actorRouter.post('/', authenticate, authAdmin, add)
actorRouter.put('/:id', authenticate, authAdmin, update)
actorRouter.delete('/:id', authenticate, authAdmin, remove)
