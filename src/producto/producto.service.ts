import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductoEntity, Tipo } from './producto.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class ProductoService {
  constructor(
    @InjectRepository(ProductoEntity)
    private readonly productoRepository: Repository<ProductoEntity>,
  ) {}

  async findAll(): Promise<ProductoEntity[]> {
    return await this.productoRepository.find({
      relations: ['tiendas'],
    });
  }

  async findOne(id: string): Promise<ProductoEntity> {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id },
      relations: ['tiendas'],
    });
    if (!producto)
      throw new BusinessLogicException(
        `El producto con id ${id} no existe`,
        BusinessError.NOT_FOUND,
      );

    return producto;
  }

  async create(producto: ProductoEntity): Promise<ProductoEntity> {
    const values = Object.values(Tipo);
    if (!values.includes(producto.tipo)) {
      throw new BusinessLogicException(
        `El tipo de producto no existe`,
        BusinessError.NOT_FOUND,
      );
    }
    return await this.productoRepository.save(producto);
  }

  async update(id: string, producto: ProductoEntity): Promise<ProductoEntity> {
    const persistedProducto: ProductoEntity =
      await this.productoRepository.findOne({
        where: { id },
      });
    if (!persistedProducto)
      throw new BusinessLogicException(
        `El producto con id ${id} no existe`,
        BusinessError.NOT_FOUND,
      );
    const values = Object.values(Tipo);
    if (!values.includes(producto.tipo)) {
      throw new BusinessLogicException(
        `El tipo de producto no existe`,
        BusinessError.NOT_FOUND,
      );
    }

    producto.id = id;

    return await this.productoRepository.save(producto);
  }

  async delete(id: string) {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id },
    });
    if (!producto)
      throw new BusinessLogicException(
        `El producto con id ${id} no existe`,
        BusinessError.NOT_FOUND,
      );

    await this.productoRepository.remove(producto);
  }
}
