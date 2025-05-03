import { Router } from "express";
import { sanitizeSalaInput, findAll, findOne, add, update, remove } from "./sala.controller.js";
import { authAdmin, authenticate } from "../middlewares/auth.middleware.js";

export const salaRouter = Router();

salaRouter.get("/", findAll);
salaRouter.get("/:id", findOne);
salaRouter.post("/", authenticate, authAdmin, sanitizeSalaInput, add);
salaRouter.put("/:id", authenticate, authAdmin, sanitizeSalaInput, update);
salaRouter.patch("/:id", authenticate, authAdmin, sanitizeSalaInput, update);
salaRouter.delete("/:id", authenticate, authAdmin, remove);