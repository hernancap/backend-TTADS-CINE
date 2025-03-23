import { Entity, Property, ManyToMany, Collection } from "@mikro-orm/core"
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Actor } from "../actor/actor.entity.js"

@Entity()
export class Pelicula extends BaseEntity{
    @Property({nullable:false})
    nombre!: string

    @Property({nullable:false})
    genero!: string 
    
    @Property({nullable:false})
    duracion!: number
    
    @Property({nullable:false})
    director!: string 
    
    @ManyToMany(() => Actor, (actor) => actor.peliculas, {
        owner: true
    })
    actors = new Collection<Actor>(this) 

    @Property({ type: 'boolean', default: true })
    enCartelera: boolean = false;  

    @Property({ type: 'boolean', default: false })
    proximamente: boolean = true; 

} 

