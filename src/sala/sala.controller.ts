import { Request, Response, NextFunction } from "express";
import { Sala } from "./sala.entity.js";
import { orm } from "../shared/db/orm.js";
import { ObjectId } from "@mikro-orm/mongodb";
import { Asiento } from "../asiento/asiento.entity.js";

const em = orm.em;

function sanitizeSalaInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    nombre: req.body.nombre,
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
    const salas = await em.find(Sala, {});
    res.status(200).json({ message: "Found all salas", data: salas });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const sala = await em.findOneOrFail(Sala, { _id: new ObjectId(id) });
    res.status(200).json({ message: "Found sala", data: sala });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    const data = req.body.sanitizedInput;
    const sala = em.create(Sala, data);

    if (req.body.asientos && Array.isArray(req.body.asientos)) {
      req.body.asientos.forEach((asientoData: any) => {
        const asiento = em.create(Asiento, { ...asientoData, sala });
        sala.asientos.add(asiento);
      });
    }

    await em.flush();
    res.status(201).json({ message: "Sala created", data: sala });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const salaToUpdate = await em.findOneOrFail(Sala, { _id: new ObjectId(id) });
    em.assign(salaToUpdate, req.body.sanitizedInput);
    await em.flush();
    res.status(200).json({ message: "Sala updated", data: salaToUpdate });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const sala = await em.findOneOrFail(Sala, { _id: new ObjectId(id) }, {
      populate: ['asientos']
    });
    await em.removeAndFlush(sala);
    res.status(200).json({ message: "Sala y sus asientos eliminados" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { sanitizeSalaInput, findAll, findOne, add, update, remove };
