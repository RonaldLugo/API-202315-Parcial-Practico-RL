import { Test, TestingModule } from '@nestjs/testing';
import { ProductoTiendaService } from './producto-tienda.service';
import { TiendaEntity } from '../tienda/tienda.entity';
import { faker } from '@faker-js/faker';
import { ProductoEntity, Tipo } from '../producto/producto.entity';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ProductoTiendaService', () => {
  let service: ProductoTiendaService;
  let productoRepository: Repository<ProductoEntity>;
  let tiendaRepository: Repository<TiendaEntity>;
  let producto: ProductoEntity;
  let tiendasList: TiendaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductoTiendaService],
    }).compile();

    service = module.get<ProductoTiendaService>(ProductoTiendaService);
    productoRepository = module.get<Repository<ProductoEntity>>(
      getRepositoryToken(ProductoEntity),
    );
    tiendaRepository = module.get<Repository<TiendaEntity>>(
      getRepositoryToken(TiendaEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    tiendaRepository.clear();
    productoRepository.clear();

    tiendasList = [];
    for (let i = 0; i < 5; i++) {
      const tienda: TiendaEntity = await tiendaRepository.save({
        nombre: faker.company.name(),
        ciudad: faker.location.countryCode('alpha-3'),
        direccion: faker.location.streetAddress(),
      });
      tiendasList.push(tienda);
    }

    producto = await productoRepository.save({
      nombre: faker.commerce.product(),
      precio: Number(faker.commerce.price()),
      tipo: faker.helpers.enumValue(Tipo),
      tiendas: tiendasList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addStoreToProduct should thrown exception for an invalid tienda', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.commerce.product(),
      precio: Number(faker.commerce.price()),
      tipo: faker.helpers.enumValue(Tipo),
    });

    await expect(() =>
      service.addStoreToProduct(newProducto.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The tienda with the given id was not found',
    );
  });

  it('addStoreToProduct should throw an exception for an invalid producto', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.location.countryCode('alpha-3'),
      direccion: faker.location.streetAddress(),
    });

    await expect(() =>
      service.addStoreToProduct('0', newTienda.id),
    ).rejects.toHaveProperty(
      'message',
      'The producto with the given id was not found',
    );
  });

  it('findStoreFromProduct should return tienda by producto', async () => {
    const tienda: TiendaEntity = tiendasList[0];
    const storedTienda: TiendaEntity = await service.findStoreFromProduct(
      producto.id,
      tienda.id,
    );
    expect(storedTienda).not.toBeNull();
    expect(storedTienda.nombre).toBe(tienda.nombre);
    expect(storedTienda.ciudad).toBe(tienda.ciudad);
    expect(storedTienda.direccion).toBe(tienda.direccion);
  });

  it('findStoreFromProduct should throw an exception for an invalid tienda', async () => {
    await expect(() =>
      service.findStoreFromProduct(producto.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The tienda with the given id was not found',
    );
  });

  it('findStoreFromProduct should throw an exception for an invalid producto', async () => {
    const tienda: TiendaEntity = tiendasList[0];
    await expect(() =>
      service.findStoreFromProduct('0', tienda.id),
    ).rejects.toHaveProperty(
      'message',
      'The producto with the given id was not found',
    );
  });

  it('findStoreFromProduct should throw an exception for an tienda not associated to the producto', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.location.countryCode('alpha-3'),
      direccion: faker.location.streetAddress(),
    });

    await expect(() =>
      service.findStoreFromProduct(producto.id, newTienda.id),
    ).rejects.toHaveProperty(
      'message',
      'The tienda with the given id is not associated to the producto',
    );
  });

  it('findStoresFromProduct should return tiendas by producto', async () => {
    const tiendas: TiendaEntity[] = await service.findStoresFromProduct(
      producto.id,
    );
    expect(tiendas.length).toBe(5);
  });

  it('findStoresFromProduct should throw an exception for an invalid producto', async () => {
    await expect(() =>
      service.findStoresFromProduct('0'),
    ).rejects.toHaveProperty(
      'message',
      'The producto with the given id was not found',
    );
  });

  it('updateStoresFromProduct should update tiendas list for a producto', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.location.countryCode('alpha-3'),
      direccion: faker.location.streetAddress(),
    });

    const updatedProducto: ProductoEntity =
      await service.updateStoresFromProduct(producto.id, [newTienda]);
    expect(updatedProducto.tiendas.length).toBe(1);

    expect(updatedProducto.tiendas[0].nombre).toBe(newTienda.nombre);
    expect(updatedProducto.tiendas[0].ciudad).toBe(newTienda.ciudad);
    expect(updatedProducto.tiendas[0].direccion).toBe(newTienda.direccion);
  });

  it('updateStoresFromProduct should throw an exception for an invalid producto', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.location.countryCode('alpha-3'),
      direccion: faker.location.streetAddress(),
    });

    await expect(() =>
      service.updateStoresFromProduct('0', [newTienda]),
    ).rejects.toHaveProperty(
      'message',
      'The producto with the given id was not found',
    );
  });

  it('updateStoresFromProduct should throw an exception for an invalid tienda', async () => {
    const newTienda: TiendaEntity = tiendasList[0];
    newTienda.id = '0';

    await expect(() =>
      service.updateStoresFromProduct(producto.id, [newTienda]),
    ).rejects.toHaveProperty(
      'message',
      'The tienda with the given id was not found',
    );
  });

  it('deleteStoreFromProduct should remove an tienda from a producto', async () => {
    const tienda: TiendaEntity = tiendasList[0];

    await service.deleteStoreFromProduct(producto.id, tienda.id);

    const storedProducto: ProductoEntity = await productoRepository.findOne({
      where: { id: producto.id },
      relations: ['tiendas'],
    });
    const deletedTienda: TiendaEntity = storedProducto.tiendas.find(
      (a) => a.id === tienda.id,
    );

    expect(deletedTienda).toBeUndefined();
  });

  it('deleteStoreFromProduct should thrown an exception for an invalid tienda', async () => {
    await expect(() =>
      service.deleteStoreFromProduct(producto.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The tienda with the given id was not found',
    );
  });

  it('deleteStoreFromProduct should thrown an exception for an invalid producto', async () => {
    const tienda: TiendaEntity = tiendasList[0];
    await expect(() =>
      service.deleteStoreFromProduct('0', tienda.id),
    ).rejects.toHaveProperty(
      'message',
      'The producto with the given id was not found',
    );
  });

  it('deleteStoreFromProduct should thrown an exception for an non asocciated tienda', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.location.countryCode('alpha-3'),
      direccion: faker.location.streetAddress(),
    });

    await expect(() =>
      service.deleteStoreFromProduct(producto.id, newTienda.id),
    ).rejects.toHaveProperty(
      'message',
      'The tienda with the given id is not associated to the producto',
    );
  });
});
