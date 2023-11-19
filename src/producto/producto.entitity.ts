import { TiendaEntitity } from 'src/tienda/tienda.entitity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum Tipo {
  PERECEDERO = 'perecedero',
  NOPERECEDERO = 'noperecedero',
}

@Entity()
export class ProductoEntitity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  precio: number;

  @Column({
    type: 'enum',
    enum: Tipo,
    default: Tipo.NOPERECEDERO,
  })
  tipo: Tipo;

  @ManyToMany(() => TiendaEntitity, (tienda) => tienda.productos)
  @JoinTable()
  tiendas: TiendaEntitity[];
}
