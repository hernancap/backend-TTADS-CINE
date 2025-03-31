import { Entity, Property, ManyToOne, Rel } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Funcion } from "../funcion/funcion.entity.js";
import { Asiento } from "../asiento/asiento.entity.js";

export enum EstadoAsiento {
  DISPONIBLE = "disponible",
  RESERVADO = "reservado",
  VENDIDO = "vendido",
}

@Entity()
export class AsientoFuncion extends BaseEntity {
  @ManyToOne(() => Funcion, { nullable: false })
  funcion!: Rel<Funcion>;

  @ManyToOne(() => Asiento, { nullable: false })
  asiento!: Rel<Asiento>;

  @Property({ nullable: false })
  estado: EstadoAsiento = EstadoAsiento.DISPONIBLE;
}
