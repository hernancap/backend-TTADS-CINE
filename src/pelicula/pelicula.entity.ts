import { Entity, Property, ManyToMany, Collection, Enum } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Actor } from "../actor/actor.entity.js";
import { Usuario } from "../usuario/usuario.entity.js";

export enum Calificacion {
	ATP = "ATP",
	M13 = "+13",
	M16 = "+16",
	M18 = "+18",
}

@Entity()
export class Pelicula extends BaseEntity {
	@Property({ nullable: false })
	nombre!: string;

	@Property({ nullable: false })
	genero!: string;

	@Property({ nullable: false })
	duracion!: number;

	@Property({ nullable: false })
	director!: string;

	@ManyToMany(() => Actor, (actor) => actor.peliculas, {
		owner: true,
	})
	actors = new Collection<Actor>(this);

	@Property({ type: "boolean", default: true })
	enCartelera: boolean = false;

	@Property({ type: "boolean", default: false })
	proximamente: boolean = true;

	@ManyToMany(() => Usuario, (usuario) => usuario.favoritos)
	usuariosFavoritos = new Collection<Usuario>(this);

    @Property({ nullable: true })
    poster_path?: string;

	@Enum(() => Calificacion)
  	calificacion!: Calificacion;

	@Property({ nullable: true })
	sinopsis?: string;
}
