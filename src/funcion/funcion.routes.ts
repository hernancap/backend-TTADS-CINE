import { Router } from "express";
import { sanitizeFuncionInput, findAll, findOne, add, update, remove } from "./funcion.controller.js";
import { authAdmin, authenticate } from "../middlewares/auth.middleware.js";

export const funcionRouter = Router();

funcionRouter.get("/", findAll);
funcionRouter.get("/:id", findOne);
funcionRouter.post("/", authenticate, authAdmin, sanitizeFuncionInput, add);
funcionRouter.put("/:id", authenticate, authAdmin, sanitizeFuncionInput, update);
funcionRouter.patch("/:id", authenticate, authAdmin, sanitizeFuncionInput, update);
funcionRouter.delete("/:id", authenticate, authAdmin, remove);
