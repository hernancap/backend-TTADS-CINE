import { Collection, Entity, ManyToMany, Property } from "@mikro-orm/core"
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Pelicula } from "../pelicula/pelicula.entity.js"

@Entity()
export class Actor extends BaseEntity {
    @Property({nullable:false,unique:true})
    nombre!: string

    @ManyToMany(() => Pelicula, (pelicula) => pelicula.actors)
    peliculas = new Collection<Pelicula>(this)
}

