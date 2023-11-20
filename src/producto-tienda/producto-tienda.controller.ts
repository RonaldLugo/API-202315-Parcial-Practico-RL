import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { ProductoTiendaService } from './producto-tienda.service';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { TiendaEntity } from 'src/tienda/tienda.entity';
import { TiendaDto } from 'src/tienda/tienda.dto';

@Controller('products')
@UseInterceptors(BusinessErrorsInterceptor)
export class ProductoTiendaController {
  constructor(private readonly productoTiendaService: ProductoTiendaService) {}

  @Post(':productoId/tiendas/:tiendaId')
  async addStoreToProduct(
    @Param('productoId') productoId: string,
    @Param('tiendaId') tiendaId: string,
  ) {
    return await this.productoTiendaService.addStoreToProduct(
      productoId,
      tiendaId,
    );
  }

  @Get(':productoId/tiendas/:tiendaId')
  async findStoreFromProduct(
    @Param('productoId') productoId: string,
    @Param('tiendaId') tiendaId: string,
  ) {
    return await this.productoTiendaService.findStoreFromProduct(
      productoId,
      tiendaId,
    );
  }

  @Get(':productoId/tiendas')
  async findStoresFromProduct(@Param('productoId') productoId: string) {
    return await this.productoTiendaService.findStoresFromProduct(productoId);
  }

  @Put(':productoId/tiendas')
  async updateStoresFromProduct(
    @Body() tiendasDto: TiendaDto[],
    @Param('productoId') productoId: string,
  ) {
    const tiendas = plainToInstance(TiendaEntity, tiendasDto);
    return await this.productoTiendaService.updateStoresFromProduct(
      productoId,
      tiendas,
    );
  }

  @Delete(':productoId/tiendas/:tiendaId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteStoresFromProduct(
    @Param('productoId') productoId: string,
    @Param('tiendaId') tiendaId: string,
  ) {
    return await this.productoTiendaService.deleteStoreFromProduct(
      productoId,
      tiendaId,
    );
  }
}
