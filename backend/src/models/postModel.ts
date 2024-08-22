import pool from "../config/database";

export interface Post {
  id?: number;
  category_id?: number;
  author_id?: number;
  title: string;
  content: string;
  views?: number;
  created_at?: Date;
  updated_at?: Date;
  is_deleted?: boolean;
}

export interface File {
  id?: number;
  post_id: number;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  uploaded_at?: Date;
}

export const createPost = async (post: Post, files?: File[]): Promise<Post> => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const postQuery = `
      INSERT INTO posts(category_id, author_id, title, content)
      VALUES($1, $2, $3, $4)
      RETURNING *
    `;
    const postValues = [
      post.category_id,
      post.author_id,
      post.title,
      post.content,
    ];
    const postResult = await client.query(postQuery, postValues);
    const newPost = postResult.rows[0];

    if (files && files.length > 0) {
      const fileQuery = `
        INSERT INTO files(post_id, file_name, file_path, file_size, file_type)
        VALUES($1, $2, $3, $4, $5)
      `;
      for (const file of files) {
        await client.query(fileQuery, [
          newPost.id,
          file.file_name,
          file.file_path,
          file.file_size,
          file.file_type,
        ]);
      }
    }

    await client.query("COMMIT");
    return newPost;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const getPostById = async (id: number): Promise<Post | null> => {
  const query = `
    SELECT p.*, f.id as file_id, f.file_name, f.file_path, f.file_size, f.file_type
    FROM posts p
    LEFT JOIN files f ON p.id = f.post_id
    WHERE p.id = $1 AND p.is_deleted = false
  `;
  const result = await pool.query(query, [id]);
  if (result.rows.length === 0) return null;

  const post = result.rows[0];
  post.files = result.rows
    .map((row) => ({
      id: row.file_id,
      file_name: row.file_name,
      file_path: row.file_path,
      file_size: row.file_size,
      file_type: row.file_type,
    }))
    .filter((file) => file.id !== null);

  return post;
};

export const updatePost = async (
  id: number,
  updates: Partial<Post>,
  files?: File[]
): Promise<Post | null> => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const updateFields = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(", ");
    const values = Object.values(updates);

    const postQuery = `
      UPDATE posts
      SET ${updateFields}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND is_deleted = false
      RETURNING *
    `;
    const postResult = await client.query(postQuery, [id, ...values]);

    if (postResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return null;
    }

    if (files && files.length > 0) {
      await client.query("DELETE FROM files WHERE post_id = $1", [id]);
      const fileQuery = `
        INSERT INTO files(post_id, file_name, file_path, file_size, file_type)
        VALUES($1, $2, $3, $4, $5)
      `;
      for (const file of files) {
        await client.query(fileQuery, [
          id,
          file.file_name,
          file.file_path,
          file.file_size,
          file.file_type,
        ]);
      }
    }

    await client.query("COMMIT");
    return postResult.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const deletePost = async (id: number): Promise<boolean> => {
  const query = `
    UPDATE posts
    SET is_deleted = true
    WHERE id = $1 AND is_deleted = false
  `;
  const result = await pool.query(query, [id]);
  if (result.rowCount === null) return false;
  return result && result.rowCount > 0;
};

export const getPosts = async (
  page: number = 1,
  limit: number = 10
): Promise<{ posts: Post[]; total: number }> => {
  const offset = (page - 1) * limit;
  const query = `
    SELECT p.*, f.id as file_id, f.file_name, f.file_path, f.file_size, f.file_type,
           COUNT(*) OVER() as total_count
    FROM posts p
    LEFT JOIN files f ON p.id = f.post_id
    WHERE p.is_deleted = false
    ORDER BY p.created_at DESC
    LIMIT $1 OFFSET $2
  `;
  const result = await pool.query(query, [limit, offset]);

  const posts = result.rows.reduce((acc, row) => {
    const existingPost = acc.find((p: Post) => p.id === row.id);
    if (existingPost) {
      if (row.file_id) {
        existingPost.files.push({
          id: row.file_id,
          file_name: row.file_name,
          file_path: row.file_path,
          file_size: row.file_size,
          file_type: row.file_type,
        });
      }
    } else {
      const newPost = { ...row, files: [] };
      if (row.file_id) {
        newPost.files.push({
          id: row.file_id,
          file_name: row.file_name,
          file_path: row.file_path,
          file_size: row.file_size,
          file_type: row.file_type,
        });
      }
      acc.push(newPost);
    }
    return acc;
  }, []);

  const total = result.rows[0] ? parseInt(result.rows[0].total_count) : 0;

  return { posts, total };
};
