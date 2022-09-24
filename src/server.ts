import express, { Request, Response } from 'express';
import orderRoutes from './handlers/orders';
import productRoutes from './handlers/products';
import userRoutes from './handlers/users';
import dotenv from 'dotenv';

dotenv.config();

const { ENV } = process.env;

const app: express.Application = express();
let port;
if (ENV === 'test') {
  port = 3005;
}

if (ENV === 'dev') {
  port = 3000;
}

const address = `127.0.0.1:${port}`;

app.use(express.json());

app.get('/', function (req: Request, res: Response) {
  res.send('Hello World!');
});

userRoutes(app);
productRoutes(app);
orderRoutes(app);

app.listen(port, function () {
  console.log(`starting app on: ${address}`);
});

export default app;
