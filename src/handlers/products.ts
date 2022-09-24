import { Application, Request, Response } from 'express';
import { Product, ProductStore } from '../models/product';
import { verifyAuthToken } from '../services/auth';

const store = new ProductStore();

const index = async (req: Request, res: Response) => {
  try {
    const products: Product[] = await store.index();
    res.json(products);
  } catch (e) {
    res.status(400);
    res.json(e);
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const { name, price } = req.body;

    if (!name || !price) {
      res.status(422);
      res.json('Invalid data');
      return;
    }
    const product: Product = await store.create(name, price);
    res.json(product);
  } catch (e) {
    res.status(400);
    res.json(e);
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number;

    if (id === undefined) {
      res.status(422);
      res.json('Invalid data');
      return;
    }
    const product: Product = await store.show(id);
    res.json(product);
  } catch (e) {
    res.status(400);
    res.json(e);
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, price } = req.body;

    if (!name || !price || !id) {
      res.status(422);
      res.json('Invalid data');
      return;
    }
    const product: Product = await store.update(parseInt(id), {
      name,
      price: parseInt(price),
      id: undefined,
    });
    res.json(product);
  } catch (e) {
    res.status(400);
    res.json(e);
  }
};

const deleteProduct = async (req: Request, res: Response) => {
  const id = req.params.id as unknown as number;
  try {
    if (!id) {
      res.status(422);
      res.json('Invalid data');
      return;
    }
    await store.delete(id);
    res.json(`Delete product with id ${id} successfully.`);
  } catch (e) {
    res.status(400);
    res.json(`Cannot delete product with id ${id}. Detail ${e}`);
  }
};

const productRoutes = (app: Application) => {
  const DEFAULT_SLUG = '/api/products';
  app.get(`${DEFAULT_SLUG}`, index);
  app.post(`${DEFAULT_SLUG}/create`, verifyAuthToken, create);
  app.get(`${DEFAULT_SLUG}/:id`, show);
  app.put(`${DEFAULT_SLUG}/:id`, verifyAuthToken, update);
  app.delete(`${DEFAULT_SLUG}/:id`, verifyAuthToken, deleteProduct);
};

export default productRoutes;
