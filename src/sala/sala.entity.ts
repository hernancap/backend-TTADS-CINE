import { Entity, Property, Collection, OneToMany, Cascade } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Asiento } from "../asiento/asiento.entity.js";

@Entity()
export class Sala extends BaseEntity {
  @Property({ nullable: false })
  nombre!: string;

  @Property({ nullable: false })
  numFilas!: number;

  @Property({ nullable: false })
  asientosPorFila!: number;

  @OneToMany(() => Asiento, asiento => asiento.sala, {
    cascade: [Cascade.REMOVE] 
  })
  asientos = new Collection<Asiento>(this);
}
