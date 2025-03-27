import { MercadoPagoConfig, Preference } from 'mercadopago';
import 'dotenv/config'; 

const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
if (!accessToken) {
  throw new Error('La variable de entorno MERCADOPAGO_ACCESS_TOKEN no está definida');
}

const client = new MercadoPagoConfig({ accessToken });

const preference = new Preference(client);

export const MercadoPagoService = {
  async createPreference(items: { id: string; title: string; quantity: number; unit_price: number }[]) {
    try {
      const response = await preference.create({
        body: {
          items,
        },
      });
      return response;
    } catch (error) {
      console.error('Error al crear preferencia:', error);
      throw error;
    }
  },
};