import { MercadoPagoConfig, Preference } from 'mercadopago';
import 'dotenv/config'; 

const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
if (!accessToken) {
  throw new Error('La variable de entorno MERCADOPAGO_ACCESS_TOKEN no está definida');
}

const client = new MercadoPagoConfig({ accessToken });
const preference = new Preference(client);

export const MercadoPagoService = {
  async createPreference(
    items: { id: string; title: string; quantity: number; unit_price: number }[], 
    user_id: string,
    funcion_id: string,
    asiento_ids: string[]
  ) {
    try {
      const response = await preference.create({
        body: {
          items,
          metadata: {
            user_id,
            funcion_id,
            asiento_ids,
            unit_price: items[0].unit_price
          },
          back_urls: {
            success: 'http://localhost:5173/pago-exitoso',
            failure: 'http://localhost:5173/pago-fallido',
            pending: 'http://localhost:5173/pago-pendiente',
          },
          auto_return: 'approved',
          notification_url: 'https://mink-willing-finally.ngrok-free.app/api/mercadopago/webhook', 
        },
      });
      return response;
    } catch (error) {
      console.error('Error al crear preferencia:', error);
      throw error;
    }
  },
};
