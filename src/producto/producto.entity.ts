import { TiendaEntity } from '../tienda/tienda.entity';
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
export class ProductoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  precio: number;

  @Column({
    type: 'simple-enum',
    enum: Tipo,
    default: Tipo.NOPERECEDERO,
  })
  tipo: Tipo;

  @ManyToMany(() => TiendaEntity, (tienda) => tienda.productos)
  @JoinTable()
  tiendas: TiendaEntity[];
}
