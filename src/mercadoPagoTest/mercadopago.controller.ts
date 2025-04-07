import { Request, Response } from 'express';
import { MercadoPagoService } from '../services/mercadopago.service.js';
import { crearEntrada } from '../services/entrada.service.js';

export const createPreference = async (req: Request, res: Response) => {
  try {
    const { items, userId, funcionId, asientoIds } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'El cuerpo de la petición debe incluir un array de items.' });
    }

    const preference = await MercadoPagoService.createPreference(items, userId, funcionId, asientoIds);

    res.status(200).json({ message: "preferenceId creado", data: preference.id });
  } catch (error) {
    console.error('Error al crear preferencia:', error);
    res.status(500).json({ error: 'Error interno al crear preferencia' });
  }
};

export const handlePaymentNotification = async (req: Request, res: Response) => {
  try {
    const paymentId = req.body.data?.id;

    if (!paymentId) {
      return res.status(400).json({ error: "No se recibió un ID de pago válido" });
    }

    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
      },
    });
    
    const paymentData = await response.json();

    if (paymentData.status === "approved") {
      const { user_id, funcion_id, asientos_funcion_ids, unit_price } = paymentData.metadata;
      const pago_id = paymentData.id;
      const pago_fecha = new Date(paymentData.date_approved);
      const pago_metodo = paymentData.payment_method_id;

      for (const asiento_funcion_id of asientos_funcion_ids) {
        try {
          const entrada = await crearEntrada({
            usuarioId: user_id,
            funcionId: funcion_id,
            asiento_funcion_id: asiento_funcion_id,
            precio: unit_price,
            pago_id: pago_id,
            pago_fecha: pago_fecha,
            pago_metodo: pago_metodo,
          });
          console.log(`Entrada creada para asiento_funcion ${asiento_funcion_id}`, entrada);
        } catch (error) {
          console.error(`Error creando entrada para asiento ${asiento_funcion_id}:`, error);
        }
      }
      console.log("Entradas creadas correctamente después del pago aprobado.");
    } else {
      console.log("El pago no fue aprobado. Estado:", paymentData.status);
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Error en el webhook de pago:", error);
    res.status(500).json({ error: "Error interno" });
  }
};
