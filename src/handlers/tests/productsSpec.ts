import request from 'supertest';
import app from '../../server';

describe('Test Product handler', () => {
  let token = '';
  let productId: number;
  beforeAll((done: DoneFn) => {
    request(app)
      .post('/api/users/login')
      .send({ username: 'user1', password: '123456' })
      .then((res) => {
        token = res.body;
        done();
      });
  });
  it('post the create new product', (done: DoneFn) => {
    request(app)
      .post('/api/products/create')
      .send({
        name: 'iPhone 1',
        price: 869,
      })
      .set('Authorization', 'Bearer ' + token)
      .then((res) => {
        const { body, status } = res;
        expect(status).toBe(200);
        expect(body.status).not.toBe({});
        expect(body.price).toEqual(869);
        expect(body.name).toEqual('iPhone 1');
        expect(body.id).toBeGreaterThan(0);
        productId = body.id;
        done();
      });
  });

  it('get all products', (done: DoneFn) => {
    request(app)
      .get('/api/products')
      .set('Authorization', 'Bearer ' + token)
      .then((res) => {
        const { body, status } = res;
        expect(status).toBe(200);
        expect(body).not.toBe([]);
        expect(body.length).toBeGreaterThan(0);
        done();
      });
  });

  it('get one specific product', (done: DoneFn) => {
    request(app)
      .get(`/api/products/${productId}`)
      .then((res) => {
        const { body, status } = res;
        expect(status).toBe(200);
        expect(body).not.toBe({});
        expect(body.id).toBe(productId);
        expect(body.price).toBeGreaterThanOrEqual(0);
        expect(body.name).not.toBeFalsy();
        done();
      });
  });

  it('put the update product', (done: DoneFn) => {
    request(app)
      .put(`/api/products/${productId}`)
      .send({
        name: 'iPhone 3',
        price: 800,
      })
      .set('Authorization', 'Bearer ' + token)
      .then((res) => {
        const { body, status } = res;
        expect(status).toBe(200);
        expect(body).not.toBe({});
        expect(body.id).toBe(productId);
        expect(body.name).toEqual('iPhone 3');
        expect(body.price).toEqual(800);
        done();
      });
  });

  it('delete the product', (done: DoneFn) => {
    request(app)
      .delete(`/api/products/${productId}`)
      .set('Authorization', 'Bearer ' + token)
      .then((res) => {
        const { body, status } = res;
        expect(status).toBe(200);
        expect(body).not.toBeFalsy();
        expect(body).toEqual(
          `Delete product with id ${productId} successfully.`
        );
        done();
      });
  });
});
