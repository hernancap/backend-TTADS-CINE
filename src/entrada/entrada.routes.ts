import { Router } from "express";
import { sanitizeEntradaInput, findAll, findOne, add, update, remove } from "./entrada.controller.js";

export const entradaRouter = Router();

entradaRouter.get("/", findAll);
entradaRouter.get("/:id", findOne);
entradaRouter.post("/", sanitizeEntradaInput, add);
entradaRouter.put("/:id", sanitizeEntradaInput, update);
entradaRouter.patch("/:id", sanitizeEntradaInput, update);
entradaRouter.delete("/:id", remove);
