import { Router } from "express";
import { sanitizePeliculaInput, findAll, findOne, add, update, remove, reporteFavoritos } from "./pelicula.controller.js";
import { uploadMiddleware } from '../shared/multer.config.js';
import { authAdmin, authenticate } from "../middlewares/auth.middleware.js";

export const peliculaRouter = Router()

peliculaRouter.get('/', findAll)
peliculaRouter.get("/reportes/favoritos", authenticate, authAdmin, reporteFavoritos);
peliculaRouter.get('/:id', findOne)
peliculaRouter.post('/', authenticate, authAdmin, uploadMiddleware, sanitizePeliculaInput, add)
peliculaRouter.put('/:id', authenticate, authAdmin, uploadMiddleware, sanitizePeliculaInput, update)
peliculaRouter.patch('/:id', authenticate, authAdmin, uploadMiddleware, sanitizePeliculaInput, update)
peliculaRouter.delete('/:id', authenticate, authAdmin, remove)
