import { Request, Response, NextFunction } from "express";
import { Funcion } from "./funcion.entity.js";
import { orm } from "../shared/db/orm.js";
import { ObjectId } from "@mikro-orm/mongodb";
import { Sala } from "../sala/sala.entity.js";
import { Pelicula } from "../pelicula/pelicula.entity.js";
import { AsientoFuncion, EstadoAsiento } from "../asientoFuncion/asientoFuncion.entity.js";

const em = orm.em;

function sanitizeFuncionInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
      fechaHora: new Date(req.body.fechaHora),
      sala: req.body.sala,
      pelicula: req.body.pelicula,
      precio: Number(req.body.precio),
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
    let filter: any = {};
    if (req.query.pelicula) {
      filter = { pelicula: new ObjectId(req.query.pelicula as string) };
    }
    const funciones = await em.find(Funcion, filter, { populate: ["sala", "pelicula"] });
    res.status(200).json({ message: "Found all funciones", data: funciones });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const funcion = await em.findOneOrFail(
      Funcion,
      { _id: new ObjectId(id) },
      { populate: ["sala", "pelicula"] }
    );
    res.status(200).json({ message: "Found funcion", data: funcion });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    const emFork = orm.em.fork();

    await emFork.transactional(async (em) => {
      const { sala: salaId, pelicula: peliculaId, ...rest } = req.body.sanitizedInput;

      const sala = await em.findOneOrFail(Sala, { 
        _id: ObjectId.createFromHexString(salaId.toString()) 
      });
      const pelicula = await em.findOneOrFail(Pelicula, { 
        _id: ObjectId.createFromHexString(peliculaId.toString()) 
      });

      const funcionesExistentes = await em.find(Funcion, {
        sala,
        fechaHora: {
          $gte: new Date(rest.fechaHora.getTime() - 2 * 60 * 60 * 1000),
          $lte: new Date(rest.fechaHora.getTime() + 2 * 60 * 60 * 1000)
        }
      });
      if (funcionesExistentes.length > 0) {
        throw new Error('Ya existe una función programada en esta sala en un horario cercano');
      }

      const nuevaFuncion = em.create(Funcion, {
        ...rest,
        sala,
        pelicula
      });
      await em.flush();

      for (const asiento of sala.asientos.getItems()) {
        const asientoFuncion = em.create(AsientoFuncion, {
          funcion: nuevaFuncion,
          asiento,
          estado: EstadoAsiento.DISPONIBLE, 
        });
        nuevaFuncion.asientosFuncion.add(asientoFuncion);
      }
      await em.flush();
    });

    res.status(201).json({
      message: "Función creada exitosamente"
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const funcionToUpdate = await em.findOneOrFail(Funcion, { _id: new ObjectId(id) });

    if (req.body.sanitizedInput.sala) {
      const salaId = ObjectId.createFromHexString(req.body.sanitizedInput.sala);
      const sala = await em.findOneOrFail(Sala, { _id: salaId });
      req.body.sanitizedInput.sala = sala;
    }

    if (req.body.sanitizedInput.pelicula) {
      const peliculaId = ObjectId.createFromHexString(req.body.sanitizedInput.pelicula);
      const pelicula = await em.findOneOrFail(Pelicula, { _id: peliculaId });
      req.body.sanitizedInput.pelicula = pelicula;
    }

    em.assign(funcionToUpdate, req.body.sanitizedInput);
    await em.flush();
    res.status(200).json({ message: "Funcion updated", data: funcionToUpdate });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const em = orm.em.fork();
    await em.begin();

    const funcion = await em.findOneOrFail(
      Funcion,
      { _id: new ObjectId(req.params.id) },
      { populate: ['entradas'] } 
    );

    funcion.entradas.getItems().forEach(entrada => em.remove(entrada));

    await em.removeAndFlush(funcion);
    await em.commit();

    res.status(200).json({ message: "Función y entradas relacionadas eliminadas" });
  } catch (error: any) {
    await em.rollback();
    res.status(500).json({ message: error.message });
  }
}

export { sanitizeFuncionInput, findAll, findOne, add, update, remove };
