import { Request, Response, NextFunction } from "express";
import { Entrada } from "./entrada.entity.js";
import { orm } from "../shared/db/orm.js";
import { ObjectId } from "@mikro-orm/mongodb";
import { Usuario } from "../usuario/usuario.entity.js";
import { Funcion } from "../funcion/funcion.entity.js";
import { AsientoFuncion, EstadoAsiento } from "../asientoFuncion/asientoFuncion.entity.js";
import { Cupon } from "../cupon/cupon.entity.js";

const em = orm.em;

function sanitizeEntradaInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    precio: req.body.precio,
    fechaCompra: req.body.fechaCompra || new Date(),
    usuario: req.body.usuario, 
    funcion: req.body.funcion,
    asiento: req.body.asiento
  };

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });

  next();
}

async function checkCupon(em: typeof orm.em, usuario: Usuario): Promise<void> {
  const entradasCount = await em.count(Entrada, { usuario });
  if (entradasCount % 5 === 0) {
    const codigo = "codigoCupon";
    const fechaExpiracion = new Date();
    fechaExpiracion.setMonth(fechaExpiracion.getMonth() + 1);
    const newCoupon = em.create(Cupon, {
      codigo: codigo,
      descuento: 10, 
      fechaExpiracion: fechaExpiracion,
      usuario,
    });
    await em.persistAndFlush(newCoupon);
  }
}

async function findAll(req: Request, res: Response) {
  try {
    const entradas = await em.find(Entrada, {}, { populate: ["usuario", "funcion", "asientoFuncion"] });
    res.status(200).json({ message: "Found all entradas", data: entradas });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const entrada = await em.findOneOrFail(
      Entrada,
      { _id: ObjectId.createFromHexString(id) },
      { populate: ["usuario", "funcion", "asientoFuncion"] }
    );
    res.status(200).json({ message: "Found entrada", data: entrada });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    const nuevaEntrada = await orm.em.fork().transactional(async (em) => {
      const { usuario: usuarioId, funcion: funcionId, asiento: asientoId, precio } = req.body.sanitizedInput;
      
      const usuario = await em.findOneOrFail(Usuario, { _id: ObjectId.createFromHexString(usuarioId) });
      const funcion = await em.findOneOrFail(Funcion, { _id: ObjectId.createFromHexString(funcionId) });
      
      const asientoFuncion = await em.findOne(AsientoFuncion, {
        funcion,
        asiento: { _id: ObjectId.createFromHexString(asientoId) }
      });
      
      if (!asientoFuncion) {
        throw new Error('El asiento no existe en esta función');
      }
      
      if (asientoFuncion.estado !== EstadoAsiento.DISPONIBLE) {
        throw new Error('El asiento ya está ocupado para esta función');
      }

      const entrada = em.create(Entrada, {
        precio,
        usuario,
        funcion,
        asientoFuncion, 
        fechaCompra: new Date()
      });
      
      asientoFuncion.estado = EstadoAsiento.VENDIDO;
      
      await em.persistAndFlush(entrada);

      await checkCupon(em, usuario);

      return entrada;
    });
    
    res.status(201).json({
      message: "Entrada creada exitosamente",
      data: nuevaEntrada
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
      error: "Error al crear la entrada"
    });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const entradaToUpdate = await em.findOneOrFail(Entrada, { _id: new ObjectId(id) });

    if (req.body.sanitizedInput.usuario) {
      const usuarioId = ObjectId.createFromHexString(req.body.sanitizedInput.usuario);
      const usuario = await em.findOneOrFail(Usuario, { _id: usuarioId });
      req.body.sanitizedInput.usuario = usuario;
    }

    if (req.body.sanitizedInput.funcion) {
      const funcionId = ObjectId.createFromHexString(req.body.sanitizedInput.funcion);
      const funcion = await em.findOneOrFail(Funcion, { _id: funcionId });
      req.body.sanitizedInput.funcion = funcion;
    }

    em.assign(entradaToUpdate, req.body.sanitizedInput);
    await em.flush();
    res.status(200).json({ message: "Entrada updated", data: entradaToUpdate });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  const em = orm.em.fork();
  try {
      await em.begin();
      
      const entrada = await em.findOneOrFail(Entrada, { _id: ObjectId.createFromHexString(req.params.id) }, { populate: ['asientoFuncion'] });
      
      await em.removeAndFlush(entrada);
      await em.commit();
      
      res.status(200).json({ message: "Entrada deleted" });
  } catch (error: any) {
      await em.rollback();
      res.status(500).json({ message: error.message });
  }
}

export { sanitizeEntradaInput, findAll, findOne, add, update, remove };
