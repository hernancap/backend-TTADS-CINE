import { Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { ObjectId } from "@mikro-orm/mongodb";
import { AsientoFuncion, EstadoAsiento } from "./asientoFuncion.entity.js";

async function updateEstado(req: Request, res: Response) {
  try {
    const { asientoFuncionId, nuevoEstado } = req.body;
    const af = await orm.em.findOneOrFail(AsientoFuncion, { _id: ObjectId.createFromHexString(asientoFuncionId) });
    af.estado = nuevoEstado;
    await orm.em.flush();
    res.status(200).json({ message: "Estado actualizado", data: af });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { updateEstado };