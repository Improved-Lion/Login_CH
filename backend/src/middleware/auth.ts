// backend/src/middleware/auth.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import {
  createUser,
  getUserByEmail,
  getUserByUsername,
  User,
} from "../models/userModel";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password, full_name, profile_image_url } =
      req.body;

    // 사용자명 중복 체크
    const existingUsername = await getUserByUsername(username);
    if (existingUsername) {
      return res
        .status(400)
        .json({ message: "이미 사용 중인 사용자명입니다." });
    }

    // 이메일 중복 체크
    const existingEmail = await getUserByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ message: "이미 사용 중인 이메일입니다." });
    }

    // 새 사용자 생성
    const newUser: User = {
      username,
      email,
      password,
      full_name,
      profile_image_url,
      provider: "local",
    };
    const createdUser = await createUser(newUser);

    // JWT 토큰 생성
    const token = jwt.sign({ userId: createdUser.id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      message: "회원가입이 완료되었습니다.",
      user: {
        id: createdUser.id,
        username: createdUser.username,
        email: createdUser.email,
        full_name: createdUser.full_name,
        profile_image_url: createdUser.profile_image_url,
        created_at: createdUser.created_at,
        updated_at: createdUser.updated_at,
      },
      token,
    });
  } catch (error) {
    console.error("회원가입 에러:", error);
    res.status(500).json({ message: "서버 에러가 발생했습니다." });
  }
};

// JWT 토큰 검증 미들웨어

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    (req as any).userId = user.userId;
    next();
  });
};

// 추가 인증 관련 함수들...
