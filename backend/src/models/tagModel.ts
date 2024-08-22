import pool from "../config/database";

export interface Tag {
  id?: number;
  name: string;
  created_at?: Date;
}

export const getAllTags = async (): Promise<Tag[]> => {
  const query = "SELECT * FROM tags ORDER BY name";
  const result = await pool.query(query);
  return result.rows;
};

export const createTag = async (name: string): Promise<Tag> => {
  const query = "INSERT INTO tags (name) VALUES ($1) RETURNING *";
  const result = await pool.query(query, [name]);
  return result.rows[0];
};

export const updateTag = async (
  id: number,
  name: string
): Promise<Tag | null> => {
  const query = "UPDATE tags SET name = $1 WHERE id = $2 RETURNING *";
  const result = await pool.query(query, [name, id]);
  return result.rows[0] || null;
};

export const deleteTag = async (id: number): Promise<boolean> => {
  const query = "DELETE FROM tags WHERE id = $1";
  const result = await pool.query(query, [id]);
  return result.rowCount !== null && result.rowCount > 0;
};

export const addTagToPost = async (
  postId: number,
  tagId: number
): Promise<boolean> => {
  const query =
    "INSERT INTO post_tags (post_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING";
  const result = await pool.query(query, [postId, tagId]);
  return result.rowCount !== null && result.rowCount > 0;
};

export const removeTagFromPost = async (
  postId: number,
  tagId: number
): Promise<boolean> => {
  const query = "DELETE FROM post_tags WHERE post_id = $1 AND tag_id = $2";
  const result = await pool.query(query, [postId, tagId]);
  return result.rowCount !== null && result.rowCount > 0;
};
