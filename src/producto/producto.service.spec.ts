import { Test, TestingModule } from '@nestjs/testing';
import { ProductoService } from './producto.service';
import { ProductoEntity, Tipo } from './producto.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { BusinessError } from '../shared/errors/business-errors';

describe('ProductoService', () => {
  let service: ProductoService;
  let repository: Repository<ProductoEntity>;
  let productosList: ProductoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductoService],
    }).compile();

    service = module.get<ProductoService>(ProductoService);
    repository = module.get<Repository<ProductoEntity>>(
      getRepositoryToken(ProductoEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    productosList = [];
    for (let i = 0; i < 5; i++) {
      const producto: ProductoEntity = await repository.save({
        nombre: faker.commerce.product(),
        precio: Number(faker.commerce.price()),
        tipo: faker.helpers.enumValue(Tipo),
      });
      productosList.push(producto);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all productos', async () => {
    const productos: ProductoEntity[] = await service.findAll();
    expect(productos).not.toBeNull();
    expect(productos).toHaveLength(productosList.length);
  });

  it('findOne should return a producto by id', async () => {
    const storedProducto: ProductoEntity = productosList[0];
    const producto: ProductoEntity = await service.findOne(storedProducto.id);
    expect(producto).not.toBeNull();
    expect(producto.nombre).toEqual(storedProducto.nombre);
    expect(producto.precio).toEqual(storedProducto.precio);
    expect(producto.tipo).toEqual(storedProducto.tipo);
  });

  it('findOne should throw an exception for an invalid producto', async () => {
    await expect(() => service.findOne('0000-0000')).rejects.toHaveProperty(
      'type',
      BusinessError.NOT_FOUND,
    );
  });

  it('create should return a new producto', async () => {
    const producto: ProductoEntity = {
      id: '',
      nombre: faker.commerce.product(),
      precio: Number(faker.commerce.price()),
      tipo: faker.helpers.enumValue(Tipo),
      tiendas: [],
    };

    const newProducto: ProductoEntity = await service.create(producto);
    expect(newProducto).not.toBeNull();

    const storedProducto: ProductoEntity = await repository.findOne({
      where: { id: newProducto.id },
    });
    expect(storedProducto).not.toBeNull();
    expect(producto.nombre).toEqual(storedProducto.nombre);
    expect(producto.precio).toEqual(storedProducto.precio);
    expect(producto.tipo).toEqual(storedProducto.tipo);
  });

  it('create should throw an exception for an invalid tipo de producto', async () => {
    const producto: ProductoEntity = {
      id: '',
      nombre: faker.commerce.product(),
      precio: Number(faker.commerce.price()),
      tipo: 'no valido' as unknown as Tipo /* inclusion de un tipo no valido */,
      tiendas: [],
    };

    await expect(() => service.create(producto)).rejects.toHaveProperty(
      'type',
      BusinessError.NOT_FOUND,
    );
  });

  it('update should modify a producto', async () => {
    const producto: ProductoEntity = productosList[0];
    producto.nombre = 'New name';
    producto.precio = 1000;
    producto.tipo = Tipo.NOPERECEDERO;

    const updatedProducto: ProductoEntity = await service.update(
      producto.id,
      producto,
    );
    expect(updatedProducto).not.toBeNull();

    const storedProducto: ProductoEntity = await repository.findOne({
      where: { id: producto.id },
    });
    expect(storedProducto).not.toBeNull();
    expect(producto.nombre).toEqual(storedProducto.nombre);
    expect(producto.precio).toEqual(storedProducto.precio);
    expect(producto.tipo).toEqual(storedProducto.tipo);
  });

  it('update should throw an exception for an invalid producto', async () => {
    let producto: ProductoEntity = productosList[0];
    producto = {
      ...producto,
      nombre: 'New name',
      precio: 1000,
      tipo: Tipo.PERECEDERO,
    };
    await expect(() =>
      service.update('0000-0000', producto),
    ).rejects.toHaveProperty('type', BusinessError.NOT_FOUND);
  });

  it('update should throw an exception for an invalid tipo de producto', async () => {
    const producto: ProductoEntity = productosList[0];
    producto.tipo =
      'no valido' as unknown as Tipo /* inclusion de un tipo no valido */;

    await expect(() =>
      service.update(producto.id, producto),
    ).rejects.toHaveProperty('type', BusinessError.NOT_FOUND);
  });

  it('delete should remove a producto', async () => {
    const producto: ProductoEntity = productosList[0];
    await service.delete(producto.id);

    const deletedProducto: ProductoEntity = await repository.findOne({
      where: { id: producto.id },
    });
    expect(deletedProducto).toBeNull();
  });

  it('delete should throw an exception for an invalid producto', async () => {
    const producto: ProductoEntity = productosList[0];
    await service.delete(producto.id);
    await expect(() => service.delete('0000-0000')).rejects.toHaveProperty(
      'type',
      BusinessError.NOT_FOUND,
    );
  });
});
