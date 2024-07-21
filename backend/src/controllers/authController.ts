// src/controllers/authController.ts
import { Request, Response } from "express";
import * as userModel from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
export const register = async (req: Request, res: Response) => {
  try {
    const user = await userModel.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error registering user" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 이메일로 사용자 조회
    const user = await userModel.getUserByEmail(email);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 비밀번호 비교
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // JWT 토큰 생성
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      message: "Login successful",
      //user: {
      //  id: user.id,
      //  username: user.username,
      //  email: user.email,
      //  full_name: user.full_name,
      //  profile_image_url: user.profile_image_url,
      //},
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
