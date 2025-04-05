import { Router } from 'express';
import { createPreference, handlePaymentNotification } from './mercadopago.controller.js';

export const mercadoPagorouter = Router();

mercadoPagorouter.post('/create-preference', createPreference);
mercadoPagorouter.post("/webhook", handlePaymentNotification);