import { Router } from 'express';
import { createPreference } from './mercadopago.controller.js';

export const mercadoPagorouter = Router();

mercadoPagorouter.post('/create-preference', createPreference);
