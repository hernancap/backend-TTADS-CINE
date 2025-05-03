import { Router } from "express";
import { sanitizeEntradaInput, findAll, findOne, add, update, remove, reporteEntradasPorPelicula } from "./entrada.controller.js";
import { authAdmin, authenticate } from "../middlewares/auth.middleware.js";

export const entradaRouter = Router();

entradaRouter.get("/", findAll);
entradaRouter.get("/reporteEntradasPorPelicula", authenticate, authAdmin, reporteEntradasPorPelicula);
entradaRouter.get("/:id", findOne);
entradaRouter.post("/", authenticate, authAdmin, sanitizeEntradaInput, add);
entradaRouter.put("/:id", authenticate, authAdmin, sanitizeEntradaInput, update);
entradaRouter.patch("/:id", authenticate, authAdmin, sanitizeEntradaInput, update);
entradaRouter.delete("/:id", authenticate, authAdmin, remove);
