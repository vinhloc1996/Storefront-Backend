import supertest from 'supertest';
import app from '../../server';

const request = supertest(app);

describe('Test Order handler', () => {
  let token = '';
  const orderId = 1;
  beforeAll((done: DoneFn) => {
    request
      .post('/api/users/login')
      .send({ username: 'user1', password: '123456' })
      .then((res) => {
        token = res.body;
        done();
      });
  });
  it('post the create new order', (done: DoneFn) => {
    request
      .post('/api/orders/create')
      .send({
        products: [
          {
            productId: 1,
            quantity: 3,
          },
          {
            productId: 2,
            quantity: 2,
          },
          {
            productId: 3,
            quantity: 6,
          },
        ],
      })
      .set('Authorization', 'Bearer ' + token)
      .then((res) => {
        const { body, status } = res;
        expect(status).toBe(200);
        expect(body.status).not.toBe({});
        expect(body.status).toEqual('active');
        expect(body.user_id).toBeGreaterThan(0);
        expect(body.id).toBeGreaterThan(0);
        done();
      });
  });

  it('get all orders for user1', (done: DoneFn) => {
    request
      .get('/api/orders')
      .set('Authorization', 'Bearer ' + token)
      .then((res) => {
        const { body, status } = res;
        expect(status).toBe(200);
        expect(body).not.toBe([]);
        expect(body.length).toBeGreaterThan(0);
        done();
      });
  });

  it('get one specific order', (done: DoneFn) => {
    request
      .get(`/api/orders/${orderId}`)
      .set('Authorization', 'Bearer ' + token)
      .then((res) => {
        const { body, status } = res;
        expect(status).toBe(200);
        expect(body).not.toBe({});
        expect(body.id).toBe(orderId);
        expect(body.user_id).toBeGreaterThan(0);
        expect(body.status).not.toBeFalsy();
        expect(body.products).not.toBe([]);
        expect(body.products.length).toBeGreaterThan(0);
        done();
      });
  });

  it('put the update order', (done: DoneFn) => {
    request
      .put(`/api/orders/${orderId}`)
      .send({ status: 'complete' })
      .set('Authorization', 'Bearer ' + token)
      .then((res) => {
        const { body, status } = res;
        expect(status).toBe(200);
        expect(body).not.toBe({});
        expect(body.id).toBe(orderId);
        expect(body.user_id).toBeGreaterThan(0);
        expect(body.status).toEqual('complete');
        done();
      });
  });
});
