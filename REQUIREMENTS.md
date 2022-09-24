# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products
- Index '/api/products' [GET]
- Show '/api/products/:id' [GET]
- Create '/api/products/create' [POST] [token required]
- Update '/api/products/:id' [PUT] [token required]
- Delete '/api/products/:id' [DELETE] [token required]

#### Users
- Index '/api/users' [GET] [token required]
- Show '/api/users/:id' [GET] [token required]
- Create '/api/users/signup'
- Update '/api/users/:id' [PUT] [token required]
- Delete '/api/users/:id' [DELETE] [token required]
- Auth '/api/users/login' [POST]
- Change Password '/api/users/changepassword' [POST] [token required]

#### Orders
- Index '/api/orders/' [GET] [token required]
- Show '/api/orders/:id' [GET] [token required]
- Create '/api/orders/create' [POST] [token required]
- Update '/api/orders/:id' [PUT] [token required]
- ~~Delete '/orders/:id' [DELETE] [token required]~~ (I don't think it ideal to put the delete order in application)

## Data Shapes
#### Product
- id: integer
- name: varchar
- price: integer

#### User
- id: integer
- username: varchar
- firstName: varchar
- lastName: varchar
- password_hash: varchar

#### Orders
- id: integer
- user_id: integer
- status: varchar

#### Orders Products
- quantity: integer
- product_id: integer
- order_id: integer

