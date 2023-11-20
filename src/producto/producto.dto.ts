import { IsDecimal, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Tipo } from './producto.entity';
export class ProductoDto {
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @IsDecimal()
  @IsNotEmpty()
  readonly precio: number;

  @IsEnum(Tipo)
  @IsNotEmpty()
  readonly tipo: Tipo;
}
