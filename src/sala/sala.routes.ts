import { Router } from "express";
import { sanitizeSalaInput, findAll, findOne, add, update, remove, getAsientos } from "./sala.controller.js";

export const salaRouter = Router();

salaRouter.get("/", findAll);
salaRouter.get("/:id", findOne);
salaRouter.post("/", sanitizeSalaInput, add);
salaRouter.put("/:id", sanitizeSalaInput, update);
salaRouter.patch("/:id", sanitizeSalaInput, update);
salaRouter.delete("/:id", remove);
salaRouter.get("/:id/asientos", getAsientos);