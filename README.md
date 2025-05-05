# TP TTADS Cine
Trabajo practico para la materia **Técnicas y Tecnologías Avanzadas de Desarrollo de Software** de la **Universidad Tecnológica Nacional (Facultad Regional Rosario)**

Alumno: 40283 - **Caparros, Hernán** (hernancaparros@gmail.com)

## Breve descripción de la app
Aplicación Web de un Cine en el que un usuario puede comprar entradas para las funciones de las películas que están en cartelera, así como también poder ver los detalles de las películas que se estrenarán en el futuro y poder agregarlas a favoritos en su perfil.

Por otro lado, los usuarios de tipo administrador, además de tener control total en todo lo relacionado a la gestión de los datos de la aplicación, también podrá acceder a reportes que muestran un ranking de películas a estrenar según cuántos usuarios la agregaron a favoritos (útil para el momento de decidir cuántas funciones se le dedicarán a cada película en el momento de su estreno) y a reportes que muestran un ranking de películas según la cantidad de entradas vendidas en los últimos 7 días (útil para el momento de decidir cuántas funciones se le dedicarán a cada película ya estrenada en la próxima semana).

La aplicación está desarrollada en **TypeScript**. Utiliza **Node.js** como entorno de ejecución y **Express** como framework web para construir APIs y manejar rutas. La seguridad se implementa mediante **JWT (JSON Web Tokens)**. Para interactuar con la base de datos de **MongoDB**, se usa **MikroORM** como ORM.

## Proposal
[Accede aquí a la Proposal del TP](https://github.com/hernancap/backend-TTADS-CINE/blob/main/docs/proposal.md)

## Deploy de la aplicación (Backend)
https://backend-ttads-cine.onrender.com

**Aclaración:** Render "duerme" las aplicaciones si están 15 minutos sin recibir tráfico, para luego reactivarlas al momento de recibir la primera solicitud. Puede pasar que esta primera solicitud que se haga al probar la app tarde varios segundos en responder (hasta que se termine de activar la app), pero luego debería funcionar correctamente.

## Deploy de la aplicación (Frontend)
https://frontend-ttads-cine.onrender.com

## Repositorio del frontend
https://github.com/hernancap/frontend-TTADS-CINE

## Video de demostración
[Accede aquí al video de demostración (link de Youtube)](https://www.youtube.com/watch?v=T9uRGmsGdhM)

# Credenciales de Prueba

## Usuarios de Prueba

| Rol           | Email       | Contraseña  |
|--------------|----------------------|-------------|
| **Admin** | `admin@admin.com`               | `adminadmin`  |
| **Cliente**      | `luisp@mail.com`               | `luisperez`  |

---

## Tarjeta de DÉBITO para Pago Aprobado  

| **Número de Tarjeta** | `4002 7686 9439 5619` |
|-------------------------|----------------------|
| **Código de Seguridad** | `123` |
| **Fecha de Expiración** | `11/30` |
| **Nombre en la Tarjeta** | `APRO` |
| **DNI** | `12345678` |

---

## Documentación  
[Accede aquí a la documentación de la Aplicación](https://github.com/hernancap/backend-TTADS-CINE/tree/main/docs) 

# Para instalación local:

## Requisitos previos
- Node.js (versión 18.x o superior) y npm instalados.
- MongoDB instalado localmente o una cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) para uso en la nube.

## Instalación y ejecución
1. Clona el repositorio:
   ```bash
   git clone https://github.com/hernancap/backend-TTADS-CINE.git
   cd backend-TTADS-CINE
   ```
2. Instala las dependencias
    ```bash
    npm install
    ```
3. (OPCIONAL) Crea un archivo `.env.development` basado en el ejemplo proporcionado (ver sección de Variables de Entorno). 

4. Ejecuta la aplicación en modo desarrollo
    ```bash
    npm run dev
    ```
---

### **Configuración de variables de entorno**
#### **Archivo `.env.development` de ejemplo:** 
```env
# MongoDB (URL completa para MongoDB, local o en la nube)
# En caso de no configurarlo, se asignará la siguiente URL por defecto:
MONGODB_URL=mongodb://localhost:27017/cine 

# MercadoPago (Token para testeo de aplicaciones obtenido de MercadoPago)
# El modo desarrollo está modificado para poder funcionar sin MercadoPago
MERCADOPAGO_ACCESS_TOKEN=TEST-999999999-9999...

# JWT (Token de seguridad) 
JWT_SECRET=clave_secreta

# frontend (URL del frontend de la aplicación)
# En caso de no configurarlo, se asignará la siguiente URL por defecto:
FRONTEND_URL=http://localhost:5173

# Puerto 
# En caso de no configurarlo, se asignará el siguiente puerto por defecto:
PORT=3000

# Ngrok (Token que se obtiene de ngrok, necesario en caso de usar MercadoPago)
NGROK_TOKEN=tu_token_aqui
```

