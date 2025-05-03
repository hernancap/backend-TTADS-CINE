import { Router } from "express";
import { updateEstado, getAsientosFuncion } from "./asientoFuncion.controller.js";
import { authAdmin, authenticate } from "../middlewares/auth.middleware.js";

export const asientoFuncionRouter = Router();

asientoFuncionRouter.put("/:id", authenticate, authAdmin, updateEstado);
asientoFuncionRouter.patch("/:id", authenticate, authAdmin, updateEstado);
asientoFuncionRouter.get("/disponibilidad/:funcionId", getAsientosFuncion);

