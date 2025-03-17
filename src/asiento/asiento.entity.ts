import { Entity, Property, ManyToOne, Rel } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Sala } from "../sala/sala.entity.js";

@Entity()
export class Asiento extends BaseEntity {
  @Property({ nullable: false })
  fila!: string;

  @Property({ nullable: false })
  numero!: number;

  @ManyToOne(() => Sala, { nullable: false })
  sala!: Rel<Sala>;
}
