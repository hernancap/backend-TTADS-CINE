import { Router } from "express";
import { sanitizePeliculaInput, findAll, findOne, add, update, remove } from "./pelicula.controller.js";
import { uploadMiddleware } from '../shared/multer.config.js';

export const peliculaRouter = Router()

peliculaRouter.get('/', findAll)
peliculaRouter.get('/:id', findOne)
peliculaRouter.post('/', uploadMiddleware, sanitizePeliculaInput, add)
peliculaRouter.put('/:id', uploadMiddleware, sanitizePeliculaInput, update)
peliculaRouter.patch('/:id', uploadMiddleware, sanitizePeliculaInput, update)
peliculaRouter.delete('/:id', remove)
