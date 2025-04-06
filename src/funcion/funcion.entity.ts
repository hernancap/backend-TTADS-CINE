import { Entity, Property, ManyToOne, OneToMany, Collection, Rel, Cascade, Enum } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Sala } from "../sala/sala.entity.js";
import { Pelicula } from "../pelicula/pelicula.entity.js";
import { Entrada } from "../entrada/entrada.entity.js";
import { AsientoFuncion } from "../asientoFuncion/asientoFuncion.entity.js";

export enum TipoFuncion {
  SUBTITULADA = "SUBTITULADA",
  DOBLADA = "DOBLADA / ESPAÑOL",
}

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
    
    @OneToMany(() => AsientoFuncion, asientoFuncion => asientoFuncion.funcion, {
      cascade: [Cascade.ALL],
      orphanRemoval: true,
    })
    asientosFuncion = new Collection<AsientoFuncion>(this);

    @Property({ nullable: false })
    precio!: number;

    @Enum({ items: () => TipoFuncion, default: TipoFuncion.SUBTITULADA })
    tipo!: TipoFuncion;
}
