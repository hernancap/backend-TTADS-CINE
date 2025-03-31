import { Entity, Property, Collection, OneToMany, Cascade } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Asiento } from "../asiento/asiento.entity.js";

@Entity()
export class Sala extends BaseEntity {
  @Property({ nullable: false, unique: true })
  nombre!: string;

  @OneToMany(() => Asiento, asiento => asiento.sala, {
    cascade: [Cascade.ALL],
    orphanRemoval: true,
  })
  asientos = new Collection<Asiento>(this);
}
