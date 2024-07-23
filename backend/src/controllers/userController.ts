// src/controllers/userController.ts
import { Request, Response } from "express";
import nodemailer from "nodemailer";
import * as userModel from "../models/userModel";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
export const getUserInfo = async (req: Request, res: Response) => {
  try {
    // JWT 토큰에서 추출한 사용자 ID를 사용합니다.
    const userId = (req as any).userId; // 인증 미들웨어에서 설정된 userId를 사용
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await userModel.getUserById(userId);

    if (user) {
      // 민감한 정보를 제외하고 필요한 정보만 반환
      const { id, username, email, full_name, profile_image_url } = user;
      res.json({ id, username, email, full_name, profile_image_url });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error in getUserInfo:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserByEmail = async (req: Request, res: Response) => {
  try {
    const userEmail = req.params.userEmail;
    const user = await userModel.getUserByEmail(userEmail);

    if (user) {
      // 민감한 정보를 제외하고 필요한 정보만 반환
      const { id, username, email, full_name, profile_image_url } = user;
      res.json({ id, username, email, full_name, profile_image_url });
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
    console.log(`Sending verification code for email: ${email}`);

    const user = await userModel.getUserByEmail(email);
    if (!user) {
      console.log(`User not found for email: ${email}`);
      return res.status(404).json({ message: "User not found" });
    }

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    console.log(`Generated verification code: ${verificationCode}`);

    await userModel.saveVerificationCode(email, verificationCode);
    console.log(`Verification code saved to database for email: ${email}`);

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
    res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const verifyCode = async (req: Request, res: Response) => {
  try {
    const { email, verificationCode } = req.body;
    console.log(
      `Verifying code for email: ${email}, code: ${verificationCode}`
    );

    const isValid = await userModel.verifyCode(email, verificationCode);
    console.log(`Verification result: ${isValid}`);

    if (isValid) {
      const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" });
      res.json({ isValid: true, token });
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

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, password, verificationCode } = req.body;
    console.log("Received reset password request:", {
      email,
      verificationCode,
    });

    const user = await userModel.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    console.log("User found:", {
      userVerificationCode: user.verification_code,
      userVerificationCodeExpires: user.verification_code_expires,
    });

    // 인증 코드 검증 로직
    const isCodeValid = await userModel.verifyCode(email, verificationCode);
    if (!isCodeValid) {
      return res.status(400).json({ message: "잘못된 인증 코드입니다." });
    }

    // 비밀번호 재설정 및 인증 코드 초기화를 동시에 수행
    const success = await userModel.resetPasswordAndClearCode(email, password);

    if (success) {
      res.json({ message: "비밀번호가 성공적으로 재설정되었습니다." });
    } else {
      res
        .status(500)
        .json({ message: "비밀번호 재설정 중 오류가 발생했습니다." });
    }
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};
