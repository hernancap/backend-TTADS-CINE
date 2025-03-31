import { Router } from "express";
import { updateEstado, getAsientosFuncion } from "./asientoFuncion.controller.js";

export const asientoFuncionRouter = Router();

asientoFuncionRouter.put("/:id", updateEstado);
asientoFuncionRouter.patch("/:id", updateEstado);
asientoFuncionRouter.get("/disponibilidad/:funcionId", getAsientosFuncion);

