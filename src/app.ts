import 'reflect-metadata'
import express from 'express'
import { peliculaRouter } from './pelicula/pelicula.routes.js'
import { orm } from './shared/db/orm.js'
import { RequestContext } from '@mikro-orm/core'
import { actorRouter } from './actor/actor.routes.js'
import cors from 'cors'
import { salaRouter } from './sala/sala.routes.js'
import { asientoRouter } from './asiento/asiento.routes.js'
import { funcionRouter } from './funcion/funcion.routes.js'
import { entradaRouter } from './entrada/entrada.routes.js'
import { usuarioRouter } from './usuario/usuario.routes.js'
import { cuponRouter } from './cupon/cupon.routes.js'
import { asientoFuncionRouter } from './asientoFuncion/asientoFuncion.routes.js'
import dotenv from 'dotenv'

import { mercadoPagorouter } from './mercadoPagoTest/mercadopago.routes.js'


const app = express()

dotenv.config();
app.use('/uploads', express.static('uploads')); 

app.use(cors({
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true 
  }));

app.use(express.json())

app.use((req, res, next)=>{
    RequestContext.create(orm.em, next)
})

app.use('/api/peliculas', peliculaRouter)
app.use('/api/actors', actorRouter)
app.use('/api/salas', salaRouter)
app.use('/api/asientos', asientoRouter)
app.use('/api/funciones', funcionRouter)
app.use('/api/entradas', entradaRouter)
app.use('/api/usuarios', usuarioRouter)
app.use('/api/cupones', cuponRouter)
app.use('/api/mercadopago', mercadoPagorouter);
app.use('/api/asientofuncion', asientoFuncionRouter)

app.use((_, res)=>{
    res.status(404).send({message: 'Resource not found'})
})

app.listen(3000, ()=>{
    console.log('Server running on http://localhost:3000/')
})
