import { Entity, Property, ManyToOne, OneToMany, Collection, Rel, Cascade } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Sala } from "../sala/sala.entity.js";
import { Pelicula } from "../pelicula/pelicula.entity.js";
import { Entrada } from "../entrada/entrada.entity.js";

@Entity()
export class Funcion extends BaseEntity {
    @Property({ nullable: false })
    fechaHora!: Date;
    
    @ManyToOne(() => Sala, { nullable: false })
    sala!: Rel<Sala>;
    
    @ManyToOne(() => Pelicula, { nullable: false })
    pelicula!: Rel<Pelicula>;
    
    @OneToMany(() => Entrada, entrada => entrada.funcion, {
        cascade: [Cascade.ALL], 
        orphanRemoval: true 
      })
    entradas = new Collection<Entrada>(this);

    @Property({ nullable: false, default: false })
    isCancelled: boolean = false;

    @Property({ nullable: false, default: true })
    isActive: boolean = true;

    @Property({ nullable: false })
    precio!: number;

}