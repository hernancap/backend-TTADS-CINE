import { MikroORM } from "@mikro-orm/core"
import { MongoHighlighter } from "@mikro-orm/mongo-highlighter"
import { MongoDriver } from "@mikro-orm/mongodb"


export const orm = await MikroORM.init({
    entities: ['dist/**/*.entity.js'],
    entitiesTs: ['src/**/*.entity.ts'],
    dbName: 'cine',
//    type: 'mongo',
    driver: MongoDriver,
    clientUrl: 'mongodb://localhost:27017/cine?replicaSet=rs0',
    highlighter: new MongoHighlighter(),
    debug: true,
    driverOptions: {
        replicaSet: 'rs0', 
      },
})

