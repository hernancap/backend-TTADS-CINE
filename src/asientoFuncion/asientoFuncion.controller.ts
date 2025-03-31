import { Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { ObjectId } from "@mikro-orm/mongodb";
import { AsientoFuncion } from "./asientoFuncion.entity.js";

const em = orm.em;

async function updateEstado(req: Request, res: Response) {
  try {
    const { asientoFuncionId, nuevoEstado } = req.body;
    const af = await orm.em.findOneOrFail(AsientoFuncion, { _id: ObjectId.createFromHexString(asientoFuncionId) });
    af.estado = nuevoEstado;
    await em.flush();
    res.status(200).json({ message: "Estado actualizado", data: af });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function getAsientosFuncion(req: Request, res: Response) {
  try {
    const funcionId = ObjectId.createFromHexString(req.params.funcionId);
    const asientosFuncion = await em.find(AsientoFuncion, { funcion: funcionId }, { populate: ['asiento'] });

    res.status(200).json({ data: asientosFuncion });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { updateEstado, getAsientosFuncion };