// src/controllers/userController.ts
import { Request, Response } from "express";
import nodemailer from "nodemailer";
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

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    ciphers: "SSLv3",
  },
});

export const sendVerificationCode = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await userModel.getUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    await userModel.saveVerificationCode(email, verificationCode);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Verification Code",
      text: `Your verification code is: ${verificationCode}`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "Verification code sent successfully" });
  } catch (error) {
    console.error("Error in sendVerificationCode:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const verifyCode = async (req: Request, res: Response) => {
  try {
    const { email, verificationCode } = req.body;
    const isValid = await userModel.verifyCode(email, verificationCode);

    if (isValid) {
      res.json({ isValid: true });
    } else {
      res
        .status(400)
        .json({ isValid: false, message: "Invalid verification code" });
    }
  } catch (error) {
    console.error("Error in verifyCode:", error);
    res.status(500).json({ message: "Server error" });
  }
};
