import pool from '../config/database';
import bcrypt from 'bcrypt';

export interface User {
  id?: number;
  username: string;
  email: string;
  password: string;
}

export const createUser = async (user: User): Promise<User> => {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  const query = 'INSERT INTO users(username, email, password) VALUES($1, $2, $3) RETURNING id, username, email';
  const values = [user.username, user.email, hashedPassword];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const getUserByUsername = async (username: string): Promise<User | null> => {
  const query = 'SELECT * FROM users WHERE username = $1';
  const result = await pool.query(query, [username]);
  return result.rows[0] || null;
};

// 추가 CRUD 함수들...