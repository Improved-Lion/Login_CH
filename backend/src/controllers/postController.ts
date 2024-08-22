import { Request, Response } from "express";
import * as postModel from "../models/postModel";
import { File } from "../models/postModel";

export const createPost = async (req: Request, res: Response) => {
  try {
    const { category_id, title, content } = req.body;
    const author_id = req.user?.userId ?? undefined; // Assuming user info is attached to req by auth middleware
    const files: File[] = req.files
      ? (req.files as Express.Multer.File[]).map((file) => ({
          file_name: file.originalname,
          file_path: file.path,
          file_size: file.size,
          file_type: file.mimetype,
          post_id: 0, // This will be set after post creation
        }))
      : [];

    const post = await postModel.createPost(
      { category_id, author_id, title, content },
      files
    );
    res.status(201).json(post);
  } catch (error) {
    console.error("Error in createPost:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getPost = async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.id);
    const post = await postModel.getPostById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  } catch (error) {
    console.error("Error in getPost:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.id);
    const { category_id, title, content } = req.body;
    const files: File[] = req.files
      ? (req.files as Express.Multer.File[]).map((file) => ({
          file_name: file.originalname,
          file_path: file.path,
          file_size: file.size,
          file_type: file.mimetype,
          post_id: postId,
        }))
      : [];

    const updatedPost = await postModel.updatePost(
      postId,
      { category_id, title, content },
      files
    );
    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(updatedPost);
  } catch (error) {
    console.error("Error in updatePost:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.id);
    const result = await postModel.deletePost(postId);
    if (!result) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error in deletePost:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getPosts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const { posts, total } = await postModel.getPosts(page, limit);
    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total,
    });
  } catch (error) {
    console.error("Error in getPosts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
