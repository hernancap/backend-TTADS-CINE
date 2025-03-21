import { Entity, Property, ManyToOne, Rel } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Usuario } from "../usuario/usuario.entity.js";

@Entity()
export class Cupon extends BaseEntity {
  @Property({ nullable: false, unique: true })
  codigo!: string;

  @Property({ nullable: false })
  descuento!: number; 

  @Property({ nullable: false })
  fechaExpiracion!: Date;

  @ManyToOne(() => Usuario)
  usuario!: Rel<Usuario>;
  
}
