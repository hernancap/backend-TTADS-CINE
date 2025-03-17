import { Request, Response } from 'express'
import { Actor } from './actor.entity.js'
import { orm } from '../shared/db/orm.js'
import { ObjectId } from '@mikro-orm/mongodb';

const em = orm.em

async function findAll(req: Request, res: Response) {
  try {
    const actors = await em.find(Actor, {})
    res.status(200).json({ message: 'found all actors', data: actors })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = new ObjectId(req.params.id);  
    const actor = await em.findOneOrFail(Actor, { _id: id  })
    res.status(200).json({ message: 'found actor', data: actor })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const actor = em.create(Actor, req.body)
    await em.flush()
    res.status(201).json({ message: 'actor created', data: actor })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = req.params.id
    const actor = em.getReference(Actor, id)
    em.assign(actor, req.body)
    await em.flush()
    res.status(200).json({ message: 'actor updated' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}


async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const objectId = new ObjectId(id);
    const item = em.getReference(Actor, objectId);
    await em.removeAndFlush(item);
    res.status(200).send({ message: 'actor deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { findAll, findOne, add, update, remove }
