import { Entity, Property, OneToMany, Collection, Enum, ManyToMany, Cascade } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Entrada } from "../entrada/entrada.entity.js";
import { Pelicula } from "../pelicula/pelicula.entity.js";
import { Cupon } from "../cupon/cupon.entity.js";

export enum UserType {
	COMUN = "comun",
	ADMIN = "admin",
}

@Entity()
export class Usuario extends BaseEntity {
	@Property({ nullable: false, unique: true })
	nombre!: string;

	@Property({ nullable: false, unique: true })
	email!: string;

	@Property({ nullable: false })
	password!: string;

	@Enum({
		items: () => UserType,
		default: UserType.COMUN,
	})
	tipo!: UserType;

	@OneToMany(() => Entrada, entrada => entrada.usuario)
	entradas = new Collection<Entrada>(this);

  @OneToMany(() => Cupon, cupon => cupon.usuario, {
	cascade: [Cascade.REMOVE] 
  })
  cupones = new Collection<Cupon>(this);

  @ManyToMany(() => Pelicula, pelicula => pelicula.usuariosFavoritos, {
	owner: true,
	eager: false 
  })
  favoritos = new Collection<Pelicula>(this);

}
