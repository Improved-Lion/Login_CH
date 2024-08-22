import pool from "../config/database";

export interface Category {
  id?: number;
  name: string;
  created_at?: Date;
}

export const getAllCategories = async (): Promise<Category[]> => {
  const query = "SELECT * FROM categories ORDER BY name";
  const result = await pool.query(query);
  return result.rows;
};

export const createCategory = async (name: string): Promise<Category> => {
  const query = "INSERT INTO categories (name) VALUES ($1) RETURNING *";
  const result = await pool.query(query, [name]);
  return result.rows[0];
};

export const updateCategory = async (
  id: number,
  name: string
): Promise<Category | null> => {
  const query = "UPDATE categories SET name = $1 WHERE id = $2 RETURNING *";
  const result = await pool.query(query, [name, id]);
  return result.rows[0] || null;
};

export const deleteCategory = async (id: number): Promise<boolean> => {
  const query = "DELETE FROM categories WHERE id = $1";
  const result = await pool.query(query, [id]);
  return result.rowCount !== null && result.rowCount > 0;
};
