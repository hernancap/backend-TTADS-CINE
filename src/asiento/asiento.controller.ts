import { Request, Response, NextFunction } from "express";
import { Asiento } from "./asiento.entity.js";
import { orm } from "../shared/db/orm.js";
import { ObjectId } from "@mikro-orm/mongodb";
import { Sala } from "../sala/sala.entity.js";

const em = orm.em;

function sanitizeAsientoInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    fila: req.body.fila,
    numero: req.body.numero,
    sala: req.body.sala,
  };

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });
  next();
}

async function findAll(req: Request, res: Response) {
  try {
    const asientos = await em.find(Asiento, {}, { populate: ["sala"] });
    res.status(200).json({ message: "Found all asientos", data: asientos });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const asiento = await em.findOneOrFail(Asiento, { _id: new ObjectId(id) }, { populate: ["sala"] });
    res.status(200).json({ message: "Found asiento", data: asiento });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    const salaId = ObjectId.createFromHexString(req.body.sanitizedInput.sala);
    const sala = await em.findOneOrFail(Sala, { _id: salaId });

    const asiento = em.create(Asiento, {
      ...req.body.sanitizedInput,
      sala,
    });

    await em.flush();
    res.status(201).json({ message: "Asiento created", data: asiento });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const asientoToUpdate = await em.findOneOrFail(Asiento, { _id: new ObjectId(id) });

    if (req.body.sanitizedInput.sala) {
      const salaId = ObjectId.createFromHexString(req.body.sanitizedInput.sala);
      const sala = await em.findOneOrFail(Sala, { _id: salaId });
      req.body.sanitizedInput.sala = sala;
    }

    em.assign(asientoToUpdate, req.body.sanitizedInput);
    await em.flush();
    res.status(200).json({ message: "Asiento updated", data: asientoToUpdate });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const asiento = await em.findOneOrFail(Asiento, { _id: new ObjectId(id) });
    await em.removeAndFlush(asiento);
    res.status(200).json({ message: "Asiento deleted" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { sanitizeAsientoInput, findAll, findOne, add, update, remove };
