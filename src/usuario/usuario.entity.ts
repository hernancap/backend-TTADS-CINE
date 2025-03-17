    import { Entity, Property, OneToMany, Collection, Enum } from "@mikro-orm/core";
    import { BaseEntity } from "../shared/db/baseEntity.entity.js";
    import { Entrada } from "../entrada/entrada.entity.js";

    export enum UserType {
        COMUN = 'comun',
        ADMIN = 'admin'
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
            default: UserType.COMUN 
          })
          tipo!: UserType;

        @OneToMany(() => Entrada, (entrada) => entrada.usuario)
        entradas = new Collection<Entrada>(this);
    }
