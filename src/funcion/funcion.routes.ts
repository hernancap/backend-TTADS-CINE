import { Router } from "express";
import { sanitizeFuncionInput, findAll, findOne, add, update, remove, cancelFunction } from "./funcion.controller.js";

export const funcionRouter = Router();

funcionRouter.get("/", findAll);
funcionRouter.get("/:id", findOne);
funcionRouter.post("/", sanitizeFuncionInput, add);
funcionRouter.put("/:id", sanitizeFuncionInput, update);
funcionRouter.patch("/:id", sanitizeFuncionInput, update);
funcionRouter.delete("/:id", remove);
funcionRouter.post("/:id/cancel", cancelFunction);
