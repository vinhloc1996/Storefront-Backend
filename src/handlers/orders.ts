import { Application, Request, Response } from 'express';
import {
  Order,
  OrderDetail,
  OrderDTO,
  OrdersProductsDTO,
  OrderStore,
  ProductQty,
} from '../models/order';
import { User } from '../models/user';
import { verifyAuthToken, getUserDataFromToken } from '../services/auth';

const store = new OrderStore();

const index = async (req: Request, res: Response) => {
  try {
    const user: User | null = getUserDataFromToken(req);
    if (user === null) {
      res.status(422);
      res.json('No user id be found');
      return;
    }

    const orders: OrderDTO[] = await store.index(user.id || -1);
    res.json(orders);
  } catch (e) {
    res.status(400);
    res.json(e);
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const products = req.body.products as unknown as ProductQty[];
    const user: User | null = getUserDataFromToken(req);
    if (user === null || !user.id) {
      res.status(422);
      res.json('No user id be found');
      return;
    }
    if (!products) {
      res.status(422);
      res.send('Invalid data');
      return;
    }

    const order: OrdersProductsDTO = await store.create(products, user.id);
    res.json(order);
  } catch (e) {
    res.status(400);
    res.json(e);
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number;
    if (!id) {
      res.status(422);
      res.send('Invalid data');
      return;
    }
    const order: OrderDetail = await store.show(id);
    res.json(order);
  } catch (e) {
    res.status(400);
    res.json(e);
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number;
    const status = req.body.status as unknown as string;

    if (!id || !status) {
      res.status(422);
      res.send('Invalid data');
      return;
    }

    const order: Order = await store.update(id, status);
    res.json(order);
  } catch (e) {
    res.status(400);
    res.json(e);
  }
};

const orderRoutes = (app: Application) => {
  const DEFAULT_SLUG = '/api/orders';
  app.get(`${DEFAULT_SLUG}`, verifyAuthToken, index);
  app.post(`${DEFAULT_SLUG}/create`, verifyAuthToken, create);
  app.get(`${DEFAULT_SLUG}/:id`, verifyAuthToken, show);
  app.put(`${DEFAULT_SLUG}/:id`, verifyAuthToken, update);
};

export default orderRoutes;
