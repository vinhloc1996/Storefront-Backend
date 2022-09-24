import { NextFunction, Request, Response } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../models/user';
import bcrypt from 'bcrypt';

dotenv.config();

const { TOKEN_SECRET, BCRYPT_PEPPER, SALT_ROUNDS } = process.env;

export function signAuthToken(user: User) {
  //Depend on how we want to expose the data, we could include first name and last name in the token as well
  const { username, id } = user;
  return jwt.sign({ username, id }, TOKEN_SECRET as Secret);
}

export function verifyAuthToken(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!req.headers || !req.headers.authorization) {
    res.status(401);
    res.json('Access denied, invalid token');
    return;
  }

  try {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, TOKEN_SECRET as Secret);
    next();
  } catch (err) {
    res.status(401);
    res.json('Invalid token');
  }
}

export function hashPassword(rawPassword: string): string {
  try {
    const hash = bcrypt.hashSync(
      rawPassword + BCRYPT_PEPPER,
      parseInt(SALT_ROUNDS + '')
    );
    return hash;
  } catch (err) {
    throw new Error(`Error while hasing password. Detail: ${err}`);
  }
}

export function compareHashPassword(
  rawPassword: string,
  hashPassword: string
): boolean {
  try {
    const result = bcrypt.compareSync(
      rawPassword + BCRYPT_PEPPER,
      hashPassword
    );
    return result;
  } catch (err) {
    console.error(`Error while comparing hash passwords. Detail: ${err}`);
    return false;
  }
}

export function getUserDataFromToken(req: Request): User | null {
  if (!req.headers || !req.headers.authorization) {
    return null;
  }

  try {
    const token = req.headers.authorization.split(' ')[1];
    const user: User = jwt.decode(token) as User;
    return user;
  } catch (err) {
    return null;
  }
}
