import { Router } from 'express'
import { findAll, findOne, add, update, remove } from './actor.controller.js'

export const actorRouter = Router()

actorRouter.get('/', findAll)
actorRouter.get('/:id', findOne)
actorRouter.post('/', add)
actorRouter.put('/:id', update)
actorRouter.delete('/:id', remove)
