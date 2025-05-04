import { Router } from "express";
import { sanitizeUsuarioInput, findAll, findOne, add, update, remove, login, getMe } from "./usuario.controller.js";
import { authenticate, authAdmin } from "../middlewares/auth.middleware.js";

export const usuarioRouter = Router();

usuarioRouter.get("/", authenticate, authAdmin, findAll);
usuarioRouter.get("/me", authenticate, getMe);
usuarioRouter.get("/:id", authenticate, authAdmin, findOne);
usuarioRouter.post("/", sanitizeUsuarioInput, add);
usuarioRouter.put("/:id", sanitizeUsuarioInput, authenticate, authAdmin, update);
usuarioRouter.patch("/:id", sanitizeUsuarioInput, authenticate, authAdmin, update);
usuarioRouter.delete("/:id", authenticate, authAdmin, remove);
usuarioRouter.post("/login", login);
usuarioRouter.post("/register", sanitizeUsuarioInput, add);
