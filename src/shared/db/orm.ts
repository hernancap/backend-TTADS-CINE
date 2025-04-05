import { MikroORM } from "@mikro-orm/core"
import { MongoHighlighter } from "@mikro-orm/mongo-highlighter"
import { MongoDriver } from "@mikro-orm/mongodb"
import 'dotenv/config'; 


export const orm = await MikroORM.init({
    entities: ['dist/**/*.entity.js'],
    entitiesTs: ['src/**/*.entity.ts'],
    dbName: 'cine',
    driver: MongoDriver,
    clientUrl: `mongodb+srv://hernancaparros:${process.env.MONGODB_PASSWORD}@cluster0.jlbuugw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
    highlighter: new MongoHighlighter(),
//    debug: true,
})