import { Router } from "express";
import { sanitizeAsientoInput, findAll, findOne, add, update, remove } from "./asiento.controller.js";
import { authAdmin, authenticate } from "../middlewares/auth.middleware.js";

export const asientoRouter = Router();

asientoRouter.get("/", findAll);
asientoRouter.get("/:id", findOne);
asientoRouter.post("/", authenticate, authAdmin, sanitizeAsientoInput, add);
asientoRouter.put("/:id", authenticate, authAdmin, sanitizeAsientoInput, update);
asientoRouter.patch("/:id", authenticate, authAdmin, sanitizeAsientoInput, update);
asientoRouter.delete("/:id", authenticate, authAdmin, remove);
