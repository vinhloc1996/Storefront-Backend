import client from '../database';

export interface User {
  firstname: string | null;
  lastname: string | null;
  username: string | null;
  password_hash: string | null;
  id: number | null;
}

export class UserStore {
  async index(): Promise<User[]> {
    try {
      const connection = await client.connect();
      const sql = 'SELECT * FROM "users";';
      const result = await connection.query(sql);
      connection.release();

      return result.rows as User[];
    } catch (err) {
      throw new Error(`Error while getting users ${err}`);
    }
  }

  async show(id: number): Promise<User> {
    try {
      const sql = 'SELECT * FROM "users" WHERE id=($1);';
      const connection = await client.connect();
      const result = await connection.query(sql, [id]);
      connection.release();
      return result.rows[0] as User;
    } catch (err) {
      throw new Error(`Error while getting user with ${id}. Detail: ${err}`);
    }
  }

  async create(user: User): Promise<User> {
    const { firstname, lastname, username, password_hash } = user;

    try {
      const sql =
        'INSERT INTO "users" (firstname, lastname, username, password_hash) VALUES($1, $2, $3, $4) RETURNING *;';
      const connection = await client.connect();
      const result = await connection.query(sql, [
        firstname,
        lastname,
        username,
        password_hash,
      ]);
      connection.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Error while adding user ${username}. Detail: ${err}`);
    }
  }

  async update(
    id: number,
    newFirstname: string,
    newLastname: string
  ): Promise<User> {
    try {
      const sql =
        'UPDATE "users" SET firstname = $1, lastname = $2 WHERE id = $3 RETURNING *;';
      const connection = await client.connect();
      const result = await connection.query(sql, [
        newFirstname,
        newLastname,
        id,
      ]);
      connection.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(
        `Error while updating firstname ${newFirstname} lastname ${newLastname}. Detail: ${err}`
      );
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const sql = 'DELETE FROM "users" WHERE id=($1);';
      const connection = await client.connect();

      await connection.query(sql, [id]);

      connection.release();
    } catch (err) {
      throw new Error(`Error while deleting user with ${id}. Detail ${err}`);
    }
  }

  async getUserByUsername(username: string): Promise<User | null> {
    try {
      const sql = 'SELECT * FROM "users" WHERE username=($1);';
      const connection = await client.connect();
      const results = await connection.query(sql, [username]);
      connection.release();

      if (results.rows.length > 0) {
        const user: User = results.rows[0] as User;
        return user;
      }
      return null;
    } catch (err) {
      throw new Error(
        `Error while authenticating user ${username}. Detail ${err}`
      );
    }
  }

  async updatePassword(id: number, newPasswordHash: string): Promise<boolean> {
    try {
      const sql =
        'UPDATE "users" SET password_hash = $1 WHERE id = $2 RETURNING *;';
      const connection = await client.connect();
      const result = await connection.query(sql, [newPasswordHash, id]);
      return result.rowCount > 0;
    } catch (err) {
      console.log(err);
      throw new Error(
        `Error while changing password for user ${id}. Detail ${err}`
      );
    }
  }
}
