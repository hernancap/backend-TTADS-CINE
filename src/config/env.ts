import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');
const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const envPath = path.resolve(rootDir, `.env.${mode}`);

const result = dotenv.config({ path: envPath });
if (result.error) {
  console.error(`Error al cargar el archivo .env.${mode}:`, result.error);
  process.exit(1);
}

console.log(`Variables de entorno cargadas desde: ${envPath}`);

const productionRequiredVars = [
  'MERCADOPAGO_ACCESS_TOKEN',
  'JWT_SECRET',
  'FRONTEND_URL',
  'MONGODB_URL'
];

const requiredEnvVars = mode === 'production' ? productionRequiredVars : [];

const missingEnvVars = requiredEnvVars.filter(
  varName => !process.env[varName]
);

if (missingEnvVars.length > 0) {
  console.error('Las siguientes variables de entorno son requeridas pero no están definidas:',
    missingEnvVars.join(', '));
  process.exit(1);
}

const defaultPort = mode === 'production' ? 8080 : 3000;

export const env = {
  nodeEnv: mode,
  port: parseInt(process.env.PORT || defaultPort.toString(), 10),
  mercadopago: {
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || 'token_invalido'
  },
  mongodb: {
    url: process.env.MONGODB_URL || 'mongodb://localhost:27017/cine'
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'secreto'
  },
  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:5173/'
  },
  ngrok: {
    token: process.env.NGROK_TOKEN || 'token_invalido'
  }
};
