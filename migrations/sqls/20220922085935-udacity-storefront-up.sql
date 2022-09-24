CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  firstname VARCHAR(100),
  lastname VARCHAR(100),
  password_hash VARCHAR(250) NOT NULL
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(250),
  price INTEGER
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users (id),
  status VARCHAR(20)
);

CREATE TABLE orders_products (
  product_id INTEGER NOT NULL REFERENCES products (id),
  order_id INTEGER NOT NULL REFERENCES orders (id),
  quantity INTEGER
);

/*Seeding users data*/
INSERT INTO users (username, firstname, lastname, password_hash) VALUES('user1', 'Doe', 'Nick', '$2b$10$wXJDUmSS4..JiAneRQx5f.6ylNOm7u4SUoss2gPwnsrFh43TFSE8G');
INSERT INTO users (username, firstname, lastname, password_hash) VALUES('user2', 'Joe', 'Nathan', '$2b$10$.Td8lQtGpI9uRQLy8Qsw5eAb5mAP1qp5GQimLz/W6bdeRQ50f0pyC');
INSERT INTO users (username, firstname, lastname, password_hash) VALUES('user3', 'Doe', 'Joe', '$2b$10$Zoq3J3TBy35C9saJvF4.euXnn7zzTFi7nGmqGZYvUd29kI2FZ3WG6');

/*Seeding products data*/
INSERT INTO products (name, price) VALUES('Laptop A', 1099);
INSERT INTO products (name, price) VALUES('Mouse B', 69);
INSERT INTO products (name, price) VALUES('Keyboard C', 129);

/*Seeding orders data*/
INSERT INTO orders (user_id, status) VALUES(1, 'active');
INSERT INTO orders (user_id, status) VALUES(2, 'complete');
INSERT INTO orders (user_id, status) VALUES(3, 'complete');
INSERT INTO orders (user_id, status) VALUES(1, 'complete');
INSERT INTO orders (user_id, status) VALUES(2, 'active');
INSERT INTO orders (user_id, status) VALUES(3, 'active');

/*Seeding products_orders data*/
INSERT INTO orders_products (product_id, order_id, quantity) VALUES(1, 1, 3);
INSERT INTO orders_products (product_id, order_id, quantity) VALUES(1, 2, 1);
INSERT INTO orders_products (product_id, order_id, quantity) VALUES(2, 3, 4);
INSERT INTO orders_products (product_id, order_id, quantity) VALUES(3, 4, 10);
INSERT INTO orders_products (product_id, order_id, quantity) VALUES(1, 5, 3);
INSERT INTO orders_products (product_id, order_id, quantity) VALUES(3, 6, 2);