import supertest from 'supertest';
import app from '../../server';
import jwt from 'jsonwebtoken';
import { User } from '../../models/user';

const request = supertest(app);

describe('Test User handler', () => {
  let token = '';
  let userId: number;
  const username = 'user4';
  it('post to create new user', (done: DoneFn) => {
    request
      .post('/api/users/signup')
      .send({
        username: username,
        firstname: 'Nick',
        lastname: 'Furry',
        password: '123456',
      })
      .then((res) => {
        const { body, status } = res;
        expect(status).toBe(200);
        expect(body).not.toBeFalsy();
        token = body;
        userId = (jwt.decode(token) as unknown as User).id as number;
        done();
      });
  });

  it('get all users', (done: DoneFn) => {
    request
      .get('/api/users')
      .set('Authorization', 'Bearer ' + token)
      .then((res) => {
        const { body, status } = res;
        expect(status).toBe(200);
        expect(body).not.toBe([]);
        expect(body.length).toBeGreaterThan(0);
        done();
      });
  });

  it('get one specific user', (done: DoneFn) => {
    request
      .get(`/api/users/${userId}`)
      .set('Authorization', 'Bearer ' + token)
      .then((res) => {
        const { body, status } = res;
        expect(status).toBe(200);
        expect(body).not.toBe({});
        expect(body.id).toBe(userId);
        expect(body.username).toEqual(username);
        expect(body.password_hash).not.toBeFalsy();
        expect(body.firstname).not.toBeFalsy();
        expect(body.lastname).not.toBeFalsy();
        done();
      });
  });

  it('put the update user', (done: DoneFn) => {
    request
      .put(`/api/users/${userId}`)
      .send({
        firstname: 'Updated',
        lastname: 'Joe',
      })
      .set('Authorization', 'Bearer ' + token)
      .then((res) => {
        const { body, status } = res;
        expect(status).toBe(200);
        expect(body).not.toBe({});
        expect(body.id).toBe(userId);
        expect(body.username).toEqual(username);
        expect(body.password_hash).not.toBeFalsy();
        expect(body.firstname).toEqual('Updated');
        expect(body.lastname).toEqual('Joe');
        done();
      });
  });

  it('post change the user password', (done: DoneFn) => {
    request
      .post(`/api/users/changepassword`)
      .send({
        username: username,
        curPassword: '123456',
        newPassword: '12345',
      })
      .set('Authorization', 'Bearer ' + token)
      .then((res) => {
        const { body, status } = res;
        expect(status).toBe(200);
        expect(body).not.toBeFalsy();
        expect(body).toEqual('Change password successfully');
        done();
      });
  });

  it('delete the user', (done: DoneFn) => {
    request
      .delete(`/api/users/${userId}`)
      .set('Authorization', 'Bearer ' + token)
      .then((res) => {
        const { body, status } = res;
        expect(status).toBe(200);
        expect(body).not.toBeFalsy();
        expect(body).toEqual(`Delete user with id ${userId} successfully.`);
        done();
      });
  });
});
