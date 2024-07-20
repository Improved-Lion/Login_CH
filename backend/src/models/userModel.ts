// backend/src/models/userModel.ts
import pool from "../config/database";
import bcrypt from "bcrypt";

export interface User {
  id?: number;
  username: string;
  email: string;
  password: string;
  full_name?: string;
  profile_image_url?: string;
  provider?: string;
  provider_id?: string;
  access_token?: string;
  created_at?: Date;
  updated_at?: Date;
}
export const createUser = async (user: User): Promise<User> => {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  const query = `
    INSERT INTO users(username, email, password, full_name, profile_image_url, provider)
    VALUES($1, $2, $3, $4, $5, $6)
    RETURNING id, username, email, full_name, profile_image_url, provider, created_at, updated_at
  `;
  const values = [
    user.username,
    user.email,
    hashedPassword,
    user.full_name || null,
    user.profile_image_url || null,
    user.provider || "local",
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
};
export const getUserByUsername = async (
  username: string
): Promise<User | null> => {
  const query = "SELECT * FROM users WHERE username = $1";
  const result = await pool.query(query, [username]);
  return result.rows[0] || null;
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const query = "SELECT * FROM users WHERE email = $1";
  const result = await pool.query(query, [email]);
  return result.rows[0] || null;
};

export const getUserById = async (id: string): Promise<User | null> => {
  const query =
    "SELECT id, username, email, full_name, profile_image_url FROM users WHERE id = $1";
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
};

// 추가 CRUD 함수들...
