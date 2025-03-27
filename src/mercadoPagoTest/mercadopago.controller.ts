import { Request, Response } from 'express';
import { MercadoPagoService } from '../services/mercadopago.service.js';

export const createPreference = async (req: Request, res: Response) => {
  try {
    const items = req.body.items;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'El cuerpo de la petición debe incluir un array de items.' });
    }

    const preference = await MercadoPagoService.createPreference(items);

    res.status(200).json({ message: "preferenceId creado", data: preference.id });
  } catch (error) {
    console.error('Error al crear preferencia:', error);
    res.status(500).json({ error: 'Error interno al crear preferencia' });
  }
};