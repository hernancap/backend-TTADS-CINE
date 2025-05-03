import { Router } from "express";
import { findAll, findOne, add, update, remove, findByUser } from "./cupon.controller.js";
import { authAdmin, authenticate } from "../middlewares/auth.middleware.js";

export const cuponRouter = Router();

cuponRouter.get('/', authenticate, authAdmin, findAll);
cuponRouter.get('/:id', findOne);
cuponRouter.post('/', authenticate, authAdmin, add);
cuponRouter.put('/:id', authenticate, authAdmin, update);
cuponRouter.patch('/:id', authenticate, authAdmin, update);
cuponRouter.delete('/:id', authenticate, authAdmin, remove);
cuponRouter.get('/usuario/:userId', findByUser);  
