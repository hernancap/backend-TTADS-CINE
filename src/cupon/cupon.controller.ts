import { Request, Response } from "express";
import { Cupon } from "./cupon.entity.js";
import { orm } from "../shared/db/orm.js";
import { ObjectId } from "@mikro-orm/mongodb";

const em = orm.em;

async function usoCoupon(req: Request, res: Response) {
  try {
    const id = req.params.id;

    const cupon = await em.findOneOrFail(
      Cupon,
      { _id: ObjectId.createFromHexString(id) }
    );

    if (cupon.usado) {
      return res.status(400).json({
        message: "Este cupón ya fue utilizado con anterioridad",
        code: "USADO_ANTERIORMENTE"
      });
    }

    const ahora = new Date();
    if (cupon.fechaExpiracion < ahora) {
      return res.status(400).json({
        message: "El cupón está expirado",
        code: "EXPIRADO"
      });
    }

    cupon.usado = true;
    await em.flush();

    return res.status(200).json({
      message: "Cupón aplicado correctamente",
      data: {
        id: cupon.id,
        usado: cupon.usado
      }
    });

  } catch (error: any) {
    if (error.name === "NotFoundError") {
      return res.status(404).json({
        message: "Cupón no encontrado",
        code: "NOT_FOUND"
      });
    }
    console.error("Error en useCoupon:", error);
    return res.status(500).json({
      message: "Error interno al usar el cupón",
      code: "INTERNAL_ERROR"
    });
  }
}

async function findAll(req: Request, res: Response) {
  try {
    const cupones = await em.find(Cupon, {});
    res.status(200).json({ message: "Cupones encontrados", data: cupones });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const cupon = await em.findOneOrFail(Cupon, { _id: new ObjectId(id) });
    res.status(200).json({ message: "Cupón encontrado", data: cupon });
  } catch (error: any) {
    res.status(404).json({ message: "Cupón no encontrado" });
  }
}

async function findByUser(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const cupones = await em.find(Cupon, { usuario: new ObjectId(userId), usado: false });
    res.status(200).json({ message: "Cupones del usuario encontrados", data: cupones });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    const { codigo, descuento, fechaExpiracion, usuario } = req.body;
    if (!codigo || !descuento || !fechaExpiracion || !usuario) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }
    const cupon = em.create(Cupon, {
      codigo,
      descuento,
      fechaExpiracion: new Date(fechaExpiracion),
      usuario,
      usado: false,
    });
    await em.flush();
    res.status(201).json({ message: "Cupón creado", data: cupon });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const cupon = await em.findOneOrFail(Cupon, { _id: new ObjectId(id) });
    const { codigo, descuento, fechaExpiracion, usado } = req.body;
    if (codigo) { cupon.codigo = codigo };
    if (descuento) { cupon.descuento = descuento };
    if (fechaExpiracion) { cupon.fechaExpiracion = new Date(fechaExpiracion)} ;
    if (typeof usado === 'boolean') {cupon.usado = usado};
    await em.flush();
    res.status(200).json({ message: "Cupón actualizado", data: cupon });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const cupon = await em.findOneOrFail(Cupon, { _id: new ObjectId(id) });
    await em.removeAndFlush(cupon);
    res.status(200).json({ message: "Cupón eliminado" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { findAll, findOne, add, update, remove, findByUser, usoCoupon };
