import { Router } from "express";
import { findAll, findOne, add, update, remove, findByUser } from "./cupon.controller.js";

export const cuponRouter = Router();

cuponRouter.get('/', findAll);
cuponRouter.get('/:id', findOne);
cuponRouter.post('/', add);
cuponRouter.put('/:id', update);
cuponRouter.patch('/:id', update);
cuponRouter.delete('/:id', remove);
cuponRouter.get('/usuario/:userId', findByUser);  
