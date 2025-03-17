import { Request, Response, NextFunction } from "express";
import { Asiento } from "./asiento.entity.js";
import { orm } from "../shared/db/orm.js";
import { LockMode, ObjectId } from "@mikro-orm/mongodb";
import { Sala } from "../sala/sala.entity.js";
import { Funcion } from "../funcion/funcion.entity.js";
import { Entrada } from "../entrada/entrada.entity.js";

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

async function checkAvailability(req: Request, res: Response) {
  try {
    const availability = await orm.em.transactional(async (em) => {
      const funcion = await em.findOneOrFail(
        Funcion,
        { _id: ObjectId.createFromHexString(req.params.funcionId) },
        { lockMode: LockMode.PESSIMISTIC_READ }
      );
      
      const asientos = await em.find(
        Asiento,
        { sala: funcion.sala },
        { lockMode: LockMode.PESSIMISTIC_READ }
      );
      
      const asientosDisponibles = await Promise.all(
        asientos.map(async (asiento) => {
          const entrada = await em.findOne(Entrada, { 
            asiento: asiento, 
            funcion: funcion 
          });
          return {
            id: asiento.id,
            fila: asiento.fila,
            numero: asiento.numero,
            isOccupied: !!entrada,
          };
        })
      );
      
      return asientosDisponibles;
    });
    res.status(200).json({ data: availability });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
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

export { sanitizeAsientoInput, findAll, findOne, add, update, remove, checkAvailability };
