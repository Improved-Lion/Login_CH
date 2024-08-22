import { Request, Response } from "express";
import * as tagModel from "../models/tagModel";

export const getAllTags = async (req: Request, res: Response) => {
  try {
    const tags = await tagModel.getAllTags();
    res.json(tags);
  } catch (error) {
    console.error("Error in getAllTags:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createTag = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const newTag = await tagModel.createTag(name);
    res.status(201).json(newTag);
  } catch (error) {
    console.error("Error in createTag:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateTag = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { name } = req.body;
    const updatedTag = await tagModel.updateTag(id, name);
    if (!updatedTag) {
      return res.status(404).json({ message: "Tag not found" });
    }
    res.json(updatedTag);
  } catch (error) {
    console.error("Error in updateTag:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteTag = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await tagModel.deleteTag(id);
    if (!result) {
      return res.status(404).json({ message: "Tag not found" });
    }
    res.json({ message: "Tag deleted successfully" });
  } catch (error) {
    console.error("Error in deleteTag:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addTagToPost = async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.postId);
    const { tagId } = req.body;
    const result = await tagModel.addTagToPost(postId, tagId);
    if (result) {
      res.json({ message: "Tag added to post successfully" });
    } else {
      res.status(400).json({ message: "Tag already exists for this post" });
    }
  } catch (error) {
    console.error("Error in addTagToPost:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const removeTagFromPost = async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.postId);
    const tagId = parseInt(req.params.tagId);
    const result = await tagModel.removeTagFromPost(postId, tagId);
    if (result) {
      res.json({ message: "Tag removed from post successfully" });
    } else {
      res.status(404).json({ message: "Tag not found for this post" });
    }
  } catch (error) {
    console.error("Error in removeTagFromPost:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
