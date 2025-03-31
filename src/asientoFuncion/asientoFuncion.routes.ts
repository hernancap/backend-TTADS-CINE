import { Router } from "express";
import { updateEstado } from "./asientoFuncion.controller.js";

export const entradaRouter = Router();

entradaRouter.put("/:id", updateEstado);
entradaRouter.patch("/:id", updateEstado);
