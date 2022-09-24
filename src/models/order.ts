import Client from '../database';

export interface OrderProduct {
  product_id: number | undefined;
  order_id: number | undefined;
  quantity: number | undefined;
}

export interface Order {
  id: number;
  user_id: number;
  status: string;
}

export interface OrdersProductsDTO {
  id: number;
  user_id: number;
  status: string;
  ordersProducts: OrderProduct[];
}

export interface OrderDTO {
  id: number;
  user_id: number;
  status: string;
  product_name: string;
  product_id: number;
  price: number;
  quantity: number;
}

export interface ProductQty {
  productId: number;
  quantity: number;
}

export interface ProductInOrderDTO {
  productId: number;
  name: string;
  quantity: number;
  price: number;
}

export interface OrderDetail {
  id: number;
  user_id: number;
  status: string;
  products: ProductInOrderDTO[];
}

export class OrderStore {
  async index(userId: number): Promise<OrderDTO[]> {
    try {
      const connection = await Client.connect();
      const orderSql = 'SELECT * FROM orders WHERE user_id=($1)';
      const orderResults = await connection.query(orderSql, [userId]);
      const orders: OrderDTO[] = [];
      for (const order of orderResults.rows) {
        const orderProductsSql =
          'SELECT op.product_id, p.name, p.price, op.quantity FROM orders_products op JOIN products p ON op.product_id = p.id WHERE op.order_id=($1)';
        const results = await connection.query(orderProductsSql, [order.id]);
        for (const orderProduct of results.rows) {
          orders.push({
            ...order,
            ...orderProduct,
          });
        }
      }

      connection.release();
      return orders;
    } catch (err) {
      throw new Error(`Error while getting orders. Detail ${err}`);
    }
  }

  async create(
    products: ProductQty[],
    userId: number
  ): Promise<OrdersProductsDTO> {
    try {
      const sql =
        'INSERT INTO orders (user_id, status) VALUES($1, $2) RETURNING *';
      const connection = await Client.connect();
      const orderResult = await connection.query(sql, [userId, 'active']);
      const order: Order = orderResult.rows[0];
      const ordersProducts: OrderProduct[] = [];
      for (const product of products) {
        const orderProductsSql =
          'INSERT INTO orders_products (order_id, product_id, quantity) VALUES($1, $2, $3) RETURNING *';

        const resultOrderProduct = await connection.query(orderProductsSql, [
          order.id,
          product.productId,
          product.quantity,
        ]);
        ordersProducts.push({
          ...(resultOrderProduct.rows[0] as OrderProduct),
        });
      }
      connection.release();

      return {
        ...order,
        ordersProducts,
      };
    } catch (err) {
      throw new Error(`Error while adding new order. Detail ${err}`);
    }
  }

  async show(id: number): Promise<OrderDetail> {
    try {
      const sql = 'SELECT * FROM orders WHERE id=($1)';
      const connection = await Client.connect();
      const resultOrder = await connection.query(sql, [id]);
      const order: Order = resultOrder.rows[0];

      const orderProductsSql =
        'SELECT op.product_id, p.name, p.price, op.quantity FROM orders_products op JOIN products p ON op.product_id = p.id WHERE op.order_id=($1)';
      const resultOrderProductRows = await connection.query(orderProductsSql, [
        id,
      ]);
      const products: ProductInOrderDTO[] = resultOrderProductRows.rows;

      connection.release();
      return {
        ...order,
        products,
      };
    } catch (err) {
      throw new Error(`Error while getting order ${id}. Detail ${err}`);
    }
  }

  async update(id: number, status: string): Promise<Order> {
    try {
      const sql = 'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *';
      const connection = await Client.connect();
      const resultOrder = await connection.query(sql, [status, id]);
      const order = resultOrder.rows[0];
      connection.release();

      return {
        ...order,
      };
    } catch (err) {
      throw new Error(`Error while updating order ${id}. Detail ${err}`);
    }
  }
}
