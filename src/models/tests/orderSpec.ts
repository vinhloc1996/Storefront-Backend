import {
  Order,
  OrderDetail,
  OrdersProductsDTO,
  OrderStore,
  ProductQty,
} from '../order';

const store = new OrderStore();

describe('Test order store', () => {
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

  let order: OrdersProductsDTO;
  const userId = 1;
  it('create method should add new order', async () => {
    const products: ProductQty[] = [
      {
        productId: 1,
        quantity: 3,
      },
      {
        productId: 2,
        quantity: 2,
      },
      {
        productId: 3,
        quantity: 6,
      },
    ];
    const result: OrdersProductsDTO = await store.create(products, userId);
    const { id, user_id, status, ordersProducts } = result;
    order = result;
    expect(result).not.toBeFalsy();
    expect(id).toBeGreaterThan(0);
    expect(user_id).toEqual(userId);
    expect(status).toEqual('active');
    expect(ordersProducts).not.toBe([]);
    expect(ordersProducts.length).toEqual(3);
  });

  it('index method should return a list of orders', async () => {
    const result = await store.index(userId);
    expect(result).not.toEqual([]);
    expect(result.length).toBeGreaterThan(0);
  });

  it('show method should return the correct order', async () => {
    const result: OrderDetail = await store.show(order.id || 0);
    const { id, status, user_id, products } = result;
    expect(result).not.toBeFalsy();
    expect(id).toBeGreaterThan(0);
    expect(user_id).toEqual(userId);
    expect(status).toEqual('active');
    expect(products).not.toBe([]);
    expect(products.length).toEqual(3);
  });

  it('update method should update the order status', async () => {
    const result: Order = await store.update(order.id || 0, 'complete');
    const { id, user_id, status } = result;
    expect(id).toEqual(order.id);
    expect(user_id).toEqual(userId);
    expect(status).toEqual('complete');
  });
});
