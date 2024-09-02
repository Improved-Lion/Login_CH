import { Request, Response } from "express";
import * as postModel from "../models/postModel";
import { File } from "../models/postModel";

// 오류 응답을 위한 헬퍼 함수
const sendErrorResponse = (res: Response, status: number, message: string) => {
  res.status(status).json({ message });
};

export const createPost = async (req: Request, res: Response) => {
  try {
    const { category_id, title, content } = req.body;
    const author_id = (req as any).userId;

    if (!author_id) {
      return sendErrorResponse(res, 401, "Unauthorized: User ID not found");
    }

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
    sendErrorResponse(res, 500, "Internal server error");
  }
};

export const getPost = async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.id);
    if (isNaN(postId)) {
      return sendErrorResponse(res, 400, "Invalid post ID");
    }

    const post = await postModel.getPostById(postId);
    if (!post) {
      return sendErrorResponse(res, 404, "Post not found");
    }
    res.json(post);
  } catch (error) {
    console.error("Error in getPost:", error);
    sendErrorResponse(res, 500, "Internal server error");
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.id);
    if (isNaN(postId)) {
      return sendErrorResponse(res, 400, "Invalid post ID");
    }

    const { category_id, title, content } = req.body;
    const author_id = (req as any).userId;

    if (!author_id) {
      return sendErrorResponse(res, 401, "Unauthorized: User ID not found");
    }

    // 게시물의 작성자 확인
    const existingPost = await postModel.getPostById(postId);
    if (!existingPost) {
      return sendErrorResponse(res, 404, "Post not found");
    }
    if (existingPost.author_id !== author_id) {
      return sendErrorResponse(
        res,
        403,
        "Forbidden: You can only update your own posts"
      );
    }

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
    res.json(updatedPost);
  } catch (error) {
    console.error("Error in updatePost:", error);
    sendErrorResponse(res, 500, "Internal server error");
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.id);
    if (isNaN(postId)) {
      return sendErrorResponse(res, 400, "Invalid post ID");
    }

    const author_id = (req as any).userId;
    if (!author_id) {
      return sendErrorResponse(res, 401, "Unauthorized: User ID not found");
    }

    // 게시물의 작성자 확인
    const existingPost = await postModel.getPostById(postId);
    if (!existingPost) {
      return sendErrorResponse(res, 404, "Post not found");
    }
    if (existingPost.author_id !== author_id) {
      return sendErrorResponse(
        res,
        403,
        "Forbidden: You can only delete your own posts"
      );
    }

    await postModel.deletePost(postId);
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error in deletePost:", error);
    sendErrorResponse(res, 500, "Internal server error");
  }
};

export const getPosts = async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(
      100,
      Math.max(1, parseInt(req.query.limit as string) || 10)
    );
    const { posts, total } = await postModel.getPosts(page, limit);
    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total,
    });
  } catch (error) {
    console.error("Error in getPosts:", error);
    sendErrorResponse(res, 500, "Internal server error");
  }
};
