import { MercadoPagoConfig, Preference } from 'mercadopago';
import { env } from '../config/env.js';

const accessToken = env.mercadopago.accessToken;
if (!accessToken) {
  throw new Error('La variable de entorno MERCADOPAGO_ACCESS_TOKEN no está definida');
}

const client = new MercadoPagoConfig({ accessToken });
const preference = new Preference(client);

const webhookUrl = env.nodeEnv === 'production' ? 
`${process.env.RENDER_EXTERNAL_URL || 'https://backend-ttads-cine.onrender.com'}/api/mercadopago/webhook`
  : 'https://mink-willing-finally.ngrok-free.app/api/mercadopago/webhook';

export const MercadoPagoService = {
  async createPreference(
    items: { id: string; title: string; quantity: number; unit_price: number }[], 
    user_id: string,
    funcion_id: string,
    asientos_funcion_ids: string[]
  ) {
    try {
      const response = await preference.create({
        body: {
          items,
          metadata: {
            user_id,
            funcion_id,
            asientos_funcion_ids,
            unit_price: items[0].unit_price
          },
          back_urls: {
            success: `${env.frontend.url}/pago-exitoso`,
            failure: `${env.frontend.url}/pago-fallido`,
          },
          auto_return: 'approved',
          notification_url: webhookUrl, 
        },
      });
      return response;
    } catch (error) {
      console.error('Error al crear preferencia:', error);
      throw error;
    }
  },
};
