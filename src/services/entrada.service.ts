import { orm } from "../shared/db/orm.js";
import { ObjectId } from "@mikro-orm/mongodb";
import { Entrada } from "../entrada/entrada.entity.js";
import { Usuario } from "../usuario/usuario.entity.js";
import { Funcion } from "../funcion/funcion.entity.js";
import { AsientoFuncion, EstadoAsiento } from "../asientoFuncion/asientoFuncion.entity.js";
import { Cupon } from "../cupon/cupon.entity.js";

export async function crearEntrada({
  usuarioId,
  funcionId,
  asiento_funcion_id,
  precio,
  pago_id,
  pago_fecha,
  pago_metodo
}: {
  usuarioId: string;
  funcionId: string;
  asiento_funcion_id: string;
  precio: number;
  usada?: boolean;
  pago_id?: string;
  pago_fecha?: Date;
  pago_metodo?: string;
}) {
  return await orm.em.fork().transactional(async (em) => {
    const usuario = await em.findOneOrFail(Usuario, { _id: ObjectId.createFromHexString(usuarioId) });
    const funcion = await em.findOneOrFail(Funcion, { _id: ObjectId.createFromHexString(funcionId) });
    
    const asientoFuncion = await em.findOne(AsientoFuncion, {
      _id: ObjectId.createFromHexString(asiento_funcion_id),
      funcion,
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
      fechaCompra: new Date(),
      usada: false,
      pago_id,
      pago_fecha,
      pago_metodo
    });
    
    asientoFuncion.estado = EstadoAsiento.VENDIDO;
    
    await em.persistAndFlush(entrada);

    await checkCupon(em, usuario);

    return entrada;
  });
}

async function checkCupon(em: typeof orm.em, usuario: Usuario): Promise<void> {
  const entradasCount = await em.count(Entrada, { usuario });
  if (entradasCount % 5 === 0) {
    const codigo = "CuponCliente";
    const fechaExpiracion = new Date();
    fechaExpiracion.setMonth(fechaExpiracion.getMonth() + 1);
    const newCoupon = em.create(Cupon, {
      codigo: codigo,
      descuento: 10,
      fechaExpiracion: fechaExpiracion,
      usuario,
      usado: false,
    });
    await em.persistAndFlush(newCoupon);
    console.log("Cupón creado:", newCoupon);
  }
}
