import { ProductStore, Product } from '../product';

const store = new ProductStore();

describe('Test product store', () => {
  it('should have an index method', () => {
    expect(store.index).toBeDefined();
  });

  it('should have a show method', () => {
    expect(store.show).toBeDefined();
  });

  it('should have a create method', () => {
    expect(store.create).toBeDefined();
  });

  it('should have a update method', () => {
    expect(store.update).toBeDefined();
  });

  it('should have a delete method', () => {
    expect(store.delete).toBeDefined();
  });

  let product: Product;
  it('create method should create a new product', async () => {
    const newProduct = {
      name: 'iPhone 1',
      price: 869,
    };
    const result: Product = await store.create(
      newProduct.name,
      newProduct.price
    );
    const { id, name, price } = result;
    product = result;
    expect(result).not.toBeFalsy();
    expect(id).toBeGreaterThan(0);
    expect(name).toEqual('iPhone 1');
    expect(price).toEqual(869);
  });

  it('index method should return a list of products', async () => {
    const result = await store.index();
    expect(result).not.toEqual([]);
    expect(result.length).toBeGreaterThan(0);
  });

  it('show method should return the correct product', async () => {
    const result: Product = await store.show(product.id || 0);
    const { id, name, price } = result;
    expect(result).not.toBeFalsy();
    expect(result).toEqual(product);
    expect(id).toEqual(product.id);
    expect(name).toEqual(product.name);
    expect(price).toEqual(product.price);
  });

  it('update method should update the product info', async () => {
    const updateProduct = {
      name: 'iPhone 13',
      price: 1069,
      id: undefined,
    };
    const result: Product = await store.update(product.id || 0, updateProduct);
    const { id, price, name } = result;
    expect(id).toEqual(product.id);
    expect(name).toEqual(updateProduct.name);
    expect(price).toEqual(updateProduct.price);
  });

  it('delete method should delete the product', async () => {
    await store.delete(product.id || 0);
    const list = await store.index();
    expect(list).not.toEqual([]);
    expect(list).not.toContain(product);
  });
});
