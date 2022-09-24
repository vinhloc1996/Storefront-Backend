import Client from '../database';

export interface Product {
  id: number | undefined;
  name: string | undefined;
  price: number | undefined;
}

export class ProductStore {
  async index(): Promise<Product[]> {
    try {
      const connection = await Client.connect();
      const sql = 'SELECT * FROM products';
      const results = await connection.query(sql);
      connection.release();

      return results.rows;
    } catch (err) {
      throw new Error(`Error while getting products. Detail ${err}`);
    }
  }

  async create(name: string, price: number): Promise<Product> {
    try {
      const sql =
        'INSERT INTO products (name, price) VALUES($1, $2) RETURNING *';
      const connection = await Client.connect();
      const results = await connection.query(sql, [name, price]);

      connection.release();
      return results.rows[0];
    } catch (err) {
      throw new Error(`Error while adding new product ${name}. Detail ${err}`);
    }
  }

  async show(id: number): Promise<Product> {
    try {
      const sql = 'SELECT * FROM products WHERE id=($1)';
      const connection = await Client.connect();
      const results = await connection.query(sql, [id]);
      connection.release();
      return results.rows[0];
    } catch (err) {
      throw new Error(`Error while getting product ${id}. Detail ${err}`);
    }
  }

  async update(id: number, newProduct: Product): Promise<Product> {
    try {
      const sql =
        'UPDATE products SET name = $1, price = $2 WHERE id = $3 RETURNING *';
      const connection = await Client.connect();
      const results = await connection.query(sql, [
        newProduct.name,
        newProduct.price,
        id,
      ]);
      connection.release();

      return results.rows[0];
    } catch (err) {
      throw new Error(
        `Error while updating product ${newProduct.name}. Detail ${err}`
      );
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const sql = 'DELETE FROM products WHERE id=($1)';
      const connection = await Client.connect();
      await connection.query(sql, [id]);
      connection.release();
    } catch (err) {
      throw new Error(`Error while deleting product ${id}. Detail ${err}`);
    }
  }
}
