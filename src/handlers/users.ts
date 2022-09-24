import { Application, Request, Response } from 'express';
import { User, UserStore } from '../models/user';
import {
  signAuthToken,
  verifyAuthToken,
  compareHashPassword,
  hashPassword,
} from '../services/auth';

const store = new UserStore();

const index = async (_: Request, res: Response) => {
  try {
    const users: User[] = await store.index();
    res.json(users);
  } catch (e) {
    res.json(e);
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const { firstname, lastname, username, password } = req.body;
    if (!firstname || !lastname || !username || !password) {
      res.status(422);
      res.json('Invalid data');
      return;
    }

    const password_hash = hashPassword(password);
    const user: User = await store.create({
      firstname,
      lastname,
      username,
      password_hash,
      id: null,
    });
    res.json(signAuthToken(user));
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
      res.json('Invalid user id');
      return;
    }

    const user: User = await store.show(id);
    res.json(user);
  } catch (e) {
    res.status(400);
    res.json(e);
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { firstname, lastname } = req.body;
    if (!firstname || !lastname || !id) {
      res.status(422);
      res.json('Invalid data');
      return;
    }

    const user: User = await store.update(parseInt(id), firstname, lastname);
    res.json(user);
  } catch (e) {
    res.status(400);
    res.json(e);
  }
};

const deleteUser = async (req: Request, res: Response) => {
  const id = req.params.id as unknown as number;
  try {
    if (!id) {
      res.status(422);
      res.json('Invalid data');
      return;
    }

    await store.delete(id);
    res.json(`Delete user with id ${id} successfully.`);
  } catch (e) {
    res.status(400);
    res.json(`Cannot delete user with id ${id}. Detail ${e}`);
  }
};

const authenticate = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(422);
      res.json('Invalid data');
      return;
    }
    const user: User | null = await store.getUserByUsername(username);
    if (user === null) {
      res.status(403);
      res.json(`No username ${username} be found.`);
      return;
    }
    //compare hash
    const isAuth = compareHashPassword(password, user.password_hash || '');
    if (!isAuth) {
      res.status(401);
      res.json(`Incorrect password`);
      return;
    }
    res.json(signAuthToken(user));
  } catch (e) {
    res.status(400);
    res.json(e);
  }
};

const changePassword = async (req: Request, res: Response) => {
  try {
    const { username, curPassword, newPassword } = req.body;

    if (!username || !curPassword || !newPassword) {
      res.status(422);
      res.json('Invalid data');
      return;
    }

    //check user is existed in db
    const user: User | null = await store.getUserByUsername(username);
    if (user === null) {
      res.status(403);
      res.json(`No username ${username} be found.`);
      return;
    }

    //check current password is correct
    const verifyCurrentPassword = compareHashPassword(
      curPassword,
      user.password_hash || ''
    );
    if (!verifyCurrentPassword) {
      res.status(401);
      res.json(`Incorrect current password`);
      return;
    }

    //hashing current password
    const newPasswordHash = hashPassword(newPassword);
    await store.updatePassword(
      parseInt(user.id as unknown as string),
      newPasswordHash
    );
    res.json(`Change password successfully`);
  } catch (e) {
    res.status(400);
    res.json(e);
  }
};

const userRoutes = (app: Application) => {
  const DEFAULT_SLUG = '/api/users';
  app.get(`${DEFAULT_SLUG}`, verifyAuthToken, index);
  app.post(`${DEFAULT_SLUG}/signup`, create);
  app.post(`${DEFAULT_SLUG}/login`, authenticate);
  app.post(`${DEFAULT_SLUG}/changepassword`, verifyAuthToken, changePassword);
  app.get(`${DEFAULT_SLUG}/:id`, verifyAuthToken, show);
  app.put(`${DEFAULT_SLUG}/:id`, verifyAuthToken, updateUser);
  app.delete(`${DEFAULT_SLUG}/:id`, verifyAuthToken, deleteUser);
};

export default userRoutes;
