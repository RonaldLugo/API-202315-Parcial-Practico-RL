import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductoModule } from './producto/producto.module';
import { TiendaModule } from './tienda/tienda.module';
import { ProductoTiendaModule } from './producto-tienda/producto-tienda.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoEntitity } from './producto/producto.entitity';
import { TiendaEntitity } from './tienda/tienda.entitity';

@Module({
  imports: [
    ProductoModule,
    TiendaModule,
    ProductoTiendaModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'tiendas',
      entities: [ProductoEntitity, TiendaEntitity],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
