import { User, UserStore } from '../user';

const store = new UserStore();

describe('Test user store', () => {
  it('should have an index method', () => {
    expect(store.index).toBeDefined();
  });

  it('should have a show method', () => {
    expect(store.show).toBeDefined();
  });

  it('should have a create method', () => {
    expect(store.create).toBeDefined();
  });

  it('should have a update method', () => {
    expect(store.update).toBeDefined();
  });

  it('should have a delete method', () => {
    expect(store.delete).toBeDefined();
  });

  it('should have a get user by name method', () => {
    expect(store.getUserByUsername).toBeDefined();
  });

  it('should have a change password method', () => {
    expect(store.updatePassword).toBeDefined();
  });
  let user: User;
  it('create method should signup a user', async () => {
    const result: User = await store.create({
      username: 'user5',
      firstname: 'Nick',
      lastname: 'Furry',
      password_hash:
        '$2b$10$Zoq3J3TBy35C9saJvF4.euXnn7zzTFi7nGmqGZYvUd29kI2FZ3WG6',
      id: null,
    });

    if (result) {
      const { username, firstname, lastname, password_hash, id } = result;
      user = result;
      expect(username).toBe('user5');
      expect(firstname).toBe('Nick');
      expect(lastname).toBe('Furry');
      expect(password_hash).not.toBeFalsy();
      expect(id).toBeGreaterThan(0);
    }
  });

  it('index method should return a list of users', async () => {
    const result = await store.index();
    expect(result).not.toEqual([]);
    expect(result.length).toBeGreaterThan(0);
  });

  it('show method should return the correct user', async () => {
    const result = await store.show(user.id || 0);
    expect(result).toEqual(user);
  });

  it('update method should update the user', async () => {
    const result = await store.update(
      user.id || 0,
      'New First Name',
      'New Last Name'
    );
    const { firstname, lastname } = result;
    expect(firstname).toEqual('New First Name');
    expect(lastname).toEqual('New Last Name');
  });

  it('get user by username method should return the user', async () => {
    const result = await store.getUserByUsername(user.username || '');
    expect(result).not.toBe(null);
    const { firstname, lastname, username, id } = result as User;
    expect(firstname).toEqual('New First Name');
    expect(lastname).toEqual('New Last Name');
    expect(username).toEqual(user.username);
    expect(id).toEqual(user.id);
  });

  it('update password method should change the user password', async () => {
    const result = await store.updatePassword(user.id || 0, '123456');
    expect(result).toBeTrue();
  });

  it('delete method should remove the user', async () => {
    await store.delete(user.id || 0);
    const list = await store.index();
    expect(list).not.toEqual([]);
    expect(list).not.toContain(user);
  });
});
