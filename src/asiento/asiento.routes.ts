import { Router } from "express";
import { sanitizeAsientoInput, findAll, findOne, add, update, remove, checkAvailability } from "./asiento.controller.js";

export const asientoRouter = Router();

asientoRouter.get("/", findAll);
asientoRouter.get("/:id", findOne);
asientoRouter.post("/", sanitizeAsientoInput, add);
asientoRouter.put("/:id", sanitizeAsientoInput, update);
asientoRouter.patch("/:id", sanitizeAsientoInput, update);
asientoRouter.delete("/:id", remove);
asientoRouter.get("/availability/:funcionId", checkAvailability);
