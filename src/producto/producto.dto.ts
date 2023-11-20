import { IsDecimal, IsNotEmpty, IsString } from 'class-validator';
import { Tipo } from './producto.entity';
export class ProductoDto {
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @IsDecimal()
  @IsNotEmpty()
  readonly precio: number;

  @IsNotEmpty()
  readonly Tipo: Tipo;
}
