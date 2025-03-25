import { Request, Response, NextFunction } from "express"
import { Pelicula } from "./pelicula.entity.js"
import { orm } from "../shared/db/orm.js"
import { Actor } from "../actor/actor.entity.js"
import { ObjectId } from '@mikro-orm/mongodb';

const em = orm.em

function sanitizePeliculaInput(req: Request, res: Response, next: NextFunction){

    req.body.sanitizedInput = {
        nombre: req.body.nombre,
        genero: req.body.genero,
        duracion: req.body.duracion,
        director: req.body.director,
        actors: req.body.actors,
        enCartelera: req.body.enCartelera,
        proximamente: req.body.proximamente,
    }
    Object.keys(req.body.sanitizedInput).forEach(key=>{
        if(req.body.sanitizedInput[key] === undefined){
            delete req.body.sanitizedInput[key]
        }
    })
    next()
}

async function findAll(req: Request, res: Response) {
    try {
      const { enCartelera, proximamente } = req.query;
            const filter: any = {};
      if (enCartelera !== undefined) {
        filter.enCartelera = enCartelera === 'true';
      }
      if (proximamente !== undefined) {
        filter.proximamente = proximamente === 'true';
      }
      const peliculas = await em.find(Pelicula, filter, { populate: ['actors'] });
      res.status(200).json({ message: 'found all peliculas', data: peliculas });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

async function findOne(req: Request, res: Response) {
    try {
        const id = req.params.id;
        const pelicula = await em.findOneOrFail(Pelicula, { _id: new ObjectId(id) }, { populate: ['actors'] });
        res.status(200).json({ message: 'found pelicula', data: pelicula });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

async function add(req: Request, res: Response) {
    try {
        const actorIds = (req.body.sanitizedInput.actors || []).map((id: string) => new ObjectId(id));

        const actors = await em.find(Actor, { _id: { $in: actorIds } });

        const pelicula = em.create(Pelicula, {
            ...req.body.sanitizedInput,
            actors,
            poster_path: req.file?.filename,
        });

        await em.flush();
        res.status(201).json({ message: 'pelicula created', data: pelicula });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}


async function update(req: Request, res: Response) {
    try {
        const id = req.params.id;
        const movieToUpdate = await em.findOneOrFail(Pelicula, { _id: new ObjectId(id) });

        if (req.file) {
            movieToUpdate.poster_path = req.file.filename;
          }
        
        const actorInputs = req.body.sanitizedInput.actors || [];
        const actorIds = actorInputs.map((actor: any) => ObjectId.createFromHexString(actor.id));
        const actors = await em.find(Actor, { _id: { $in: actorIds } });
        
        em.assign(movieToUpdate, { 
            ...req.body.sanitizedInput,
            actors: actors
        });
        
        await em.flush();
        res.status(200).json({ message: 'pelicula updated', data: movieToUpdate });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

async function remove(req: Request, res: Response) {
    try {
      const id = req.params.id;
  
      const objectId = new ObjectId(id);
  
      const pelicula = await em.findOne(Pelicula, { _id: objectId });
  
      if (!pelicula) {
        return res.status(404).json({ message: 'Pelicula not found' });
      }
  
      await em.removeAndFlush(pelicula);
      res.status(200).json({ message: 'Pelicula deleted' });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
}

export {sanitizePeliculaInput, findAll, findOne, add, update, remove}
