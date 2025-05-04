import { MikroORM } from "@mikro-orm/core"
import { MongoHighlighter } from "@mikro-orm/mongo-highlighter"
import { MongoDriver } from "@mikro-orm/mongodb"

export const orm = await MikroORM.init({
    entities: ['dist/**/*.entity.js'],
    entitiesTs: ['src/**/*.entity.ts'],
    dbName: 'cine',
    driver: MongoDriver,
    clientUrl: process.env.MONGODB_URL || "mongodb://localhost:27017/cine",
    highlighter: new MongoHighlighter(),
//    debug: true,
})