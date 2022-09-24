# Storefront Backend Project

- Simple project to create API by using NodeJS and Express, API will get data from Postgres DB

## Requirements to run project
Before running the project, please make sure to download/install those softwares
- NodeJS/NPM
- Docker/Docker-compose
- Bash/CMD/Power Shell
- Editor/IDE for Web/JS
- Postman
- pgAdmin - PostgreSQL GUI to view database schema/data

## Setup .env file
- Before running the project, add the `.env` file into the root folder of the project
- The data inside the file will following like this:
  ```conf
  POSTGRES_HOST=127.0.0.1
  POSTGRES_PORT=5432
  POSTGRES_DB=storefront
  POSTGRES_TEST_DB=storefront_test
  POSTGRES_TEST_PORT=5434
  POSTGRES_USER=udacity
  POSTGRES_PASSWORD=udacity1
  POSTGRES_HOST_AUTH_METHOD=trust
  BCRYPT_PEPPER=Udacity
  SALT_ROUNDS=10
  TOKEN_SECRET=Udacity
  ENV=dev
  ```
- Please **NOTE** that If you've ever need to update the value in `.env` file, please adjust the `database.json` file.
  
## Setup database.json file
- Add the database.json file into the root of project
- The data inside the file will following like this:
```json
  {
    "dev": {
      "driver": "pg",
      "host": "127.0.0.1",
      "port": 5432,
      "database": "storefront",
      "user": "udacity",
      "password": "udacity1"
    },
    "test": {
      "driver": "pg",
      "host": "127.0.0.1",
      "port": 5434,
      "database": "storefront_test",
      "user": "udacity",
      "password": "udacity1"
    }
  }
```
- Please **NOTE** that the value in this file **MUST** align with the value in `.env` file  
  
## Setup docker-compose.yml file
- Open the `docker-compose.yml` file on the root of project
- Adjust any value inside the file to sync-up with `database.json` and `.env` file

### Host and post
- As default, the application will be hosted on `127.0.0.1:3000` when `ENV=dev`. `127.0.0.1:3005` when `ENV=test`
- As default, the database will be hosted on `127.0.0.1:5432` when `ENV=dev`. `127.0.0.1:5434` when `ENV=test` (You can adjust this depend on your host machine)

## Run Project
- In the root folder, run `docker-compose up`
- Open new Bash/Command Prompt/Power Shell in root project folder, run `npm install`
- Run `npm run db-up` to setup migration for database dev
- **IMPORTANT** Make sure the `ENV=dev` is existed in `.env` file
- Run `npm run build` and `npm run start` to start the project on `127.0.0.1:3000`
- Import the `StoreFront.postman_collection.json` into Postman to see requests and its examples
- Checkout the `REQUIREMENTS.md` file to follow the DB Schema, and routes for each data

## Test Project
- In the root folder, run `docker-compose up`
- **IMPORTANT** Open `.env` file and adjust the `ENV=dev` to `ENV=test` 
- Run `npm run test`