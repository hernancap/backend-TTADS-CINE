import { Router } from "express";
import { sanitizePeliculaInput, findAll, findOne, add, update, remove } from "./pelicula.controller.js";

export const peliculaRouter = Router()

peliculaRouter.get('/', findAll)
peliculaRouter.get('/:id', findOne)
peliculaRouter.post('/', sanitizePeliculaInput, add)
peliculaRouter.put('/:id', sanitizePeliculaInput, update)
peliculaRouter.patch('/:id', sanitizePeliculaInput, update)
peliculaRouter.delete('/:id', remove)
