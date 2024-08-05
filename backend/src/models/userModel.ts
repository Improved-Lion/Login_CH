// backend/src/models/userModel.ts
import pool from "../config/database";
import bcrypt from "bcrypt";
export interface User {
  id?: number;
  email: string;
  username: string;
  password: string;
  full_name?: string;
  profile_image_url?: string;
  provider?: string;
  provider_id?: string;
  access_token?: string;
  type?: string;
  login_type?: string;
  phone?: string;
  address?: string;
  created_at?: Date;
  updated_at?: Date;
  verification_code?: string;
  verification_code_expires?: Date;
}

export const createUser = async (user: User): Promise<User> => {
  const query = `
    INSERT INTO users(username, email, password, full_name, profile_image_url, provider, provider_id, login_type, type)
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
  `;
  const values = [
    user.username,
    user.email,
    user.password, // 이미 해싱된 비밀번호
    user.full_name || null,
    user.profile_image_url || null,
    user.provider || "local",
    user.provider_id || null,
    user.login_type || "email",
    user.type || "user",
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
};
export const getUserByEmail = async (email: string): Promise<User | null> => {
  const query = "SELECT * FROM users WHERE email = $1";
  const result = await pool.query(query, [email]);
  return result.rows[0] || null;
};
export const getUserByUsername = async (
  username: string
): Promise<User | null> => {
  const query = "SELECT * FROM users WHERE username = $1";
  const result = await pool.query(query, [username]);
  return result.rows[0] || null;
};

export const getUserById = async (id: string): Promise<User | null> => {
  const query =
    "SELECT id, username, email, full_name, profile_image_url FROM users WHERE id = $1";
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
};

export const saveVerificationCode = async (
  email: string,
  code: string
): Promise<void> => {
  const query = `
    UPDATE users
    SET verification_code = $1, verification_code_expires = NOW() + INTERVAL '15 minutes'
    WHERE email = $2
  `;
  try {
    const result = await pool.query(query, [code, email]);
    console.log(
      `Verification code save result: ${result.rowCount} rows affected`
    );
    if (result.rowCount === 0) {
      console.log(`No user found with email: ${email}`);
    }
  } catch (error) {
    console.error("Error saving verification code:", error);
    throw error;
  }
};
export const verifyCode = async (
  email: string,
  code: string
): Promise<boolean> => {
  const query = `
    SELECT * FROM users
    WHERE email = $1 AND verification_code = $2 AND verification_code_expires > NOW()
  `;
  try {
    const result = await pool.query(query, [email, code]);
    console.log(`Verification query result: ${result.rows.length} rows found`);
    return result.rows.length > 0;
  } catch (error) {
    console.error("Error verifying code:", error);
    throw error;
  }
};

export const resetPassword = async (
  email: string,
  newPassword: string
): Promise<boolean> => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const query = `
    UPDATE users
    SET password = $1, verification_code = NULL, verification_code_expires = NULL
    WHERE email = $2
  `;
  const result = await pool.query(query, [hashedPassword, email]);
  return result.rowCount !== null && result.rowCount > 0;
};

export const resetPasswordAndClearCode = async (
  email: string,
  newPassword: string
): Promise<boolean> => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const query = `
    UPDATE users
    SET password = $1, verification_code = NULL, verification_code_expires = NULL
    WHERE email = $2 AND verification_code IS NOT NULL
  `;
  const result = await pool.query(query, [hashedPassword, email]);
  return result.rowCount !== null && result.rowCount > 0;
};

export const updateUser = async (
  id: number,
  updates: Partial<User>
): Promise<User | null> => {
  const updateFields = Object.keys(updates)
    .map((key, index) => `${key} = $${index + 2}`)
    .join(", ");
  const values = Object.values(updates);

  const query = `
    UPDATE users
    SET ${updateFields}
    WHERE id = $1
    RETURNING id, username, email, full_name, profile_image_url, provider, created_at, updated_at
  `;

  const result = await pool.query(query, [id, ...values]);
  return result.rows[0] || null;
};
