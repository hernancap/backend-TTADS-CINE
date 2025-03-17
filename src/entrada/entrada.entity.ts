import { Entity, Property, ManyToOne, Rel } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Usuario } from "../usuario/usuario.entity.js";
import { Funcion } from "../funcion/funcion.entity.js";
import { Asiento } from "../asiento/asiento.entity.js";

@Entity()
export class Entrada extends BaseEntity {
  @Property({ nullable: false })
  precio!: number;

  @Property({ nullable: false })
  fechaCompra: Date = new Date();

  @ManyToOne(() => Usuario, { nullable: false })
  usuario!: Rel<Usuario>;

  @ManyToOne(() => Funcion, { nullable: false })
  funcion!: Rel<Funcion>;

  @ManyToOne(() => Asiento, { nullable: false })
  asiento!: Rel<Asiento>;
}
