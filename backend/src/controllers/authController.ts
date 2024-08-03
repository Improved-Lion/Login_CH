// src/controllers/authController.ts
import { Request, Response } from "express";
import * as userModel from "../models/userModel";
import bcrypt from "bcrypt";
import axios, { AxiosError } from "axios";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "your_refresh_secret";
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

const generateTokens = (userId: number, userType: string) => {
  const accessToken = jwt.sign({ _id: userId, type: userType }, JWT_SECRET, {
    expiresIn: "1h", // 액세스 토큰 유효 기간을 1시간으로 늘림
    issuer: "FESP01",
  });
  const refreshToken = jwt.sign({ _id: userId }, JWT_REFRESH_SECRET, {
    expiresIn: "30d",
    issuer: "FESP01",
  });
  return { accessToken, refreshToken };
};

export const kakaoLogin = async (req: Request, res: Response) => {
  console.log("Received kakao login request:", req.body);
  try {
    const { code } = req.body;

    // 카카오 액세스 토큰 얻기
    let tokenResponse;
    try {
      tokenResponse = await axios.post(
        "https://kauth.kakao.com/oauth/token",
        null,
        {
          params: {
            grant_type: "authorization_code",
            client_id: process.env.KAKAO_APP_KEY,
            redirect_uri: process.env.KAKAO_REDIRECT_URI,
            code,
          },
        }
      );
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(
        "Error getting Kakao token:",
        axiosError.response?.data || axiosError.message
      );
      return res.status(400).json({
        ok: 0,
        message: "Failed to get Kakao token",
        error: axiosError.response?.data || axiosError.message,
      });
    }

    console.log("Kakao token response:", tokenResponse.data);
    const { access_token } = tokenResponse.data;

    // 카카오 사용자 정보 얻기
    let kakaoUserInfo;
    try {
      kakaoUserInfo = await axios.get("https://kapi.kakao.com/v2/user/me", {
        headers: { Authorization: `Bearer ${access_token}` },
      });
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(
        "Error getting Kakao user info:",
        axiosError.response?.data || axiosError.message
      );
      return res.status(400).json({
        ok: 0,
        message: "Failed to get Kakao user info",
        error: axiosError.response?.data || axiosError.message,
      });
    }
    console.log("Kakao user info:", kakaoUserInfo.data);

    const { id: kakaoId, kakao_account } = kakaoUserInfo.data;
    const { email, profile } = kakao_account;

    // 사용자 정보로 DB에서 사용자 찾기 또는 새로 생성
    let user = await userModel.getUserByEmail(email);
    if (!user) {
      user = await userModel.createUser({
        username: profile.nickname,
        email,
        password: "", // 소셜 로그인 사용자는 비밀번호 없음
        full_name: profile.nickname,
        profile_image_url: profile.profile_image_url,
        provider: "kakao",
        provider_id: kakaoId.toString(),
        login_type: "kakao",
        type: "user",
      });
    }

    // JWT 토큰 생성
    const { accessToken, refreshToken } = generateTokens(user.id!, user.type!);

    // 클라이언트에 응답 보내기
    res.json({
      ok: 1,
      item: {
        _id: user.id,
        email: user.email,
        name: user.username,
        type: user.type,
        loginType: user.login_type,
        phone: user.phone,
        address: user.address,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
        token: {
          accessToken,
          refreshToken,
        },
      },
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Kakao API error:", error.response?.data);
      return res.status(error.response?.status || 500).json({
        ok: 0,
        message: "Error communicating with Kakao API",
        error: error.response?.data,
      });
    }
    console.error("Unexpected error:", error);
    res.status(500).json({
      ok: 0,
      message: "서버 에러가 발생했습니다.",
      error: (error as Error).message,
    });
  }
};

export const naverLogin = async (req: Request, res: Response) => {
  try {
    const { code, state } = req.body;
    if (!code || !state) {
      return res.status(400).json({
        ok: 0,
        message: "Missing code or state",
      });
    }
    // 네이버 액세스 토큰 얻기
    const tokenResponse = await axios.post(
      "https://nid.naver.com/oauth2.0/token",
      null,
      {
        params: {
          grant_type: "authorization_code",
          client_id: process.env.NAVER_CLIENT_ID,
          client_secret: process.env.NAVER_CLIENT_SECRET,
          code,
          state,
        },
      }
    );

    const { access_token } = tokenResponse.data;

    if (!access_token) {
      throw new Error("Failed to get access token from Naver");
    }

    // 네이버 사용자 정보 얻기
    const userInfoResponse = await axios.get(
      "https://openapi.naver.com/v1/nid/me",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );

    const { response: naverUserInfo } = userInfoResponse.data;
    const { id: naverId, email, name, profile_image } = naverUserInfo;

    // 사용자 정보로 DB에서 사용자 찾기 또는 새로 생성
    let user = await userModel.getUserByEmail(email);
    if (!user) {
      const uniqueUsername = `${name}_${Math.random()
        .toString(36)
        .substr(2, 5)}`;
      user = await userModel.createUser({
        username: uniqueUsername,
        email,
        password: "",
        full_name: name,
        profile_image_url: profile_image,
        provider: "naver",
        provider_id: naverId,
        login_type: "naver",
        type: "user",
      });
    }

    // JWT 토큰 생성
    const { accessToken, refreshToken } = generateTokens(user.id!, user.type!);

    // 클라이언트에 응답 보내기
    res.json({
      ok: 1,
      item: {
        _id: user.id,
        email: user.email,
        name: user.username,
        type: user.type,
        loginType: user.login_type,
        phone: user.phone,
        address: user.address,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
        token: {
          accessToken,
          refreshToken,
        },
      },
    });
  } catch (error) {
    console.error("Naver login error:", error);
    res.status(500).json({
      ok: 0,
      message: "서버 에러가 발생했습니다.",
      error,
    });
  }
};
export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token is required" });
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as {
      email: string;
    };
    const user = await userModel.getUserByEmail(decoded?.email);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const accessToken = jwt.sign(
      { userId: user.id, type: user.type },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ accessToken });
  } catch (error) {
    res.status(401).json({ message: "Invalid refresh token" });
  }
};

export const logout = async (req: Request, res: Response) => {
  // 여기서 필요한 경우 DB에서 토큰을 무효화하는 로직을 추가할 수 있습니다.
  // 예: await invalidateToken(req.user.id);
  res.status(200).json({ message: "Logged out successfully" });
};
