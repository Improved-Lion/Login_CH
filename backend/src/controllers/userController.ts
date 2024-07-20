// src/controllers/userController.ts
import { Request, Response } from "express";
import * as userModel from "../models/userModel";

export const getUserInfo = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const user = await userModel.getUserById(userId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user information" });
  }
};

export const getUserByEmail = async (req: Request, res: Response) => {
  try {
    const userEmail = req.params.userEmail;
    const user = await userModel.getUserByEmail(userEmail);

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error in getUserByEmail:", error);
    res.status(500).json({ message: "Server error" });
  }
};
