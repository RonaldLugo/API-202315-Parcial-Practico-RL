import { Module } from '@nestjs/common';
import { ProductoTiendaService } from './producto-tienda.service';
import { ProductoEntity } from '../producto/producto.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TiendaEntity } from 'src/tienda/tienda.entity';
import { ProductoTiendaController } from './producto-tienda.controller';

@Module({
  providers: [ProductoTiendaService],
  imports: [TypeOrmModule.forFeature([ProductoEntity, TiendaEntity])],
  controllers: [ProductoTiendaController],
})
export class ProductoTiendaModule {}
