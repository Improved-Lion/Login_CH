import { Request, Response } from "express";
import * as userModel from "../models/userModel";
import axios from "axios";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import path from "path";
import bcrypt from "bcrypt";
import fs from "fs";
import multer from "multer";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "your_refresh_secret";

// 'uploads' 디렉토리의 절대 경로 설정
const uploadDir = path.join(__dirname, "..", "uploads");

// 'uploads' 디렉토리가 없으면 생성
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB 제한
});

export const register = async (req: Request, res: Response) => {
  try {
    upload.single("profile_image")(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        console.error("Multer error:", err);
        return res
          .status(400)
          .json({ message: "File upload error: " + err.message });
      } else if (err) {
        console.error("Unknown error during file upload:", err);
        return res.status(500).json({
          message: "Unknown error during file upload: " + err.message,
        });
      }

      try {
        const { password, ...otherData } = req.body;

        // 비밀번호 해싱
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const userData = {
          ...otherData,
          password: hashedPassword, // 해싱된 비밀번호 사용
          profile_image_url: req.file ? `/uploads/${req.file.filename}` : null,
          login_type: "email",
        };

        const user = await userModel.createUser(userData);

        // 비밀번호 필드를 제외하고 응답
        const { password: _, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
      } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({
          message: "Error creating user: " + (error as Error).message,
        });
      }
    });
  } catch (error) {
    console.error("Error in register function:", error);
    res
      .status(500)
      .json({ message: "Error registering user: " + (error as Error).message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 이메일로 사용자 조회
    const user = await userModel.getUserByEmail(email);

    if (!user) {
      return res
        .status(401)
        .json({ message: "User not found", errorType: "USER_NOT_FOUND" });
    }

    // 비밀번호 비교
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Invalid password", errorType: "INVALID_PASSWORD" });
    }

    // JWT 토큰 생성
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, type: user.type },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    const refreshToken = jwt.sign({ userId: user.id }, JWT_REFRESH_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Login successful",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    res
      .status(500)
      .json({ message: "Server error", errorType: "SERVER_ERROR" });
  }
};

const generateTokens = (userId: number, email: string, userType: string) => {
  const accessToken = jwt.sign(
    { userId, email, type: userType },
    process.env.JWT_SECRET!,
    {
      expiresIn: "1h",
      issuer: "FESP01",
    }
  );
  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: "30d",
    issuer: "FESP01",
  });
  return { accessToken, refreshToken };
};

const createOrUpdateUser = async (userData: any) => {
  let user = await userModel.getUserByEmail(userData.email);
  if (user) {
    user = await userModel.updateUser(user.id!, userData);
  } else {
    user = await userModel.createUser(userData);
  }
  return user;
};

const handleSocialLogin = async (
  req: Request,
  res: Response,
  socialLoginLogic: Function
) => {
  try {
    const user = await socialLoginLogic(req.body);
    const { accessToken, refreshToken } = generateTokens(
      user.id!,
      user.email!,
      user.type!
    );

    res.json({
      ok: 1,
      item: {
        _id: user.id,
        email: user.email,
        name: user.username,
        type: user.type,
        loginType: user.login_type,
        profile_image_url: user.profile_image_url,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
        token: { accessToken, refreshToken },
      },
    });
  } catch (error) {
    console.error(`${req.path} login error:`, error);
    res.status(500).json({
      ok: 0,
      message: "서버 에러가 발생했습니다.",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const kakaoLogin = (req: Request, res: Response) =>
  handleSocialLogin(req, res, async ({ code }: { code: string }) => {
    const tokenResponse = await axios.post(
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

    const { access_token } = tokenResponse.data;
    const userInfoResponse = await axios.get(
      "https://kapi.kakao.com/v2/user/me",
      { headers: { Authorization: `Bearer ${access_token}` } }
    );

    const { id: kakaoId, kakao_account } = userInfoResponse.data;
    const { email, profile } = kakao_account;

    return createOrUpdateUser({
      username: profile.nickname,
      email,
      password: "",
      full_name: profile.nickname,
      profile_image_url: profile.profile_image_url,
      provider: "kakao",
      provider_id: kakaoId.toString(),
      login_type: "kakao",
      type: "user",
    });
  });

export const naverLogin = (req: Request, res: Response) =>
  handleSocialLogin(
    req,
    res,
    async ({ code, state }: { code: string; state: string }) => {
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
      const userInfoResponse = await axios.get(
        "https://openapi.naver.com/v1/nid/me",
        { headers: { Authorization: `Bearer ${access_token}` } }
      );

      const { response: naverUserInfo } = userInfoResponse.data;
      const { id: naverId, email, name, profile_image } = naverUserInfo;

      return createOrUpdateUser({
        username: `${name}_${Math.random().toString(36).substr(2, 5)}`,
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
  );

export const googleLogin = (req: Request, res: Response) =>
  handleSocialLogin(
    req,
    res,
    async ({ credential }: { credential: string }) => {
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new Error("Failed to get Google user info");
      }

      const { sub: googleId, email, name, picture } = payload;

      if (!email) {
        throw new Error("Email not provided by Google");
      }

      return createOrUpdateUser({
        username: name || email.split("@")[0],
        email,
        password: "",
        full_name: name || "",
        profile_image_url: picture || "",
        provider: "google",
        provider_id: googleId,
        login_type: "google",
        type: "user",
      });
    }
  );

export const githubLogin = (req: Request, res: Response) =>
  handleSocialLogin(req, res, async ({ code }: { code: string }) => {
    try {
      // Get GitHub access token
      const tokenResponse = await axios.post(
        "https://github.com/login/oauth/access_token",
        null,
        {
          params: {
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code,
          },
          headers: {
            Accept: "application/json",
          },
        }
      );

      const { access_token } = tokenResponse.data;
      if (!access_token) {
        throw new Error("Failed to get access token from GitHub");
      }

      // Get user info from GitHub
      const userInfoResponse = await axios.get("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${access_token}`,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": process.env.APP_NAME || "Improved Lion",
        },
      });

      const githubUser = userInfoResponse.data;

      // If email is not public, fetch it separately
      let email = githubUser.email;
      if (!email) {
        const emailResponse = await axios.get(
          "https://api.github.com/user/emails",
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
              Accept: "application/vnd.github.v3+json",
              "User-Agent": process.env.APP_NAME || "Improved Lion",
            },
          }
        );
        const primaryEmail = emailResponse.data.find((e: any) => e.primary);
        email = primaryEmail ? primaryEmail.email : null;
      }

      return createOrUpdateUser({
        username: githubUser.login,
        email: email || `${githubUser.login}@github.com`,
        password: "",
        full_name: githubUser.name || "",
        profile_image_url: githubUser.avatar_url || "",
        provider: "github",
        provider_id: githubUser.id.toString(),
        login_type: "github",
        type: "user",
      });
    } catch (error) {
      console.error("GitHub login error:", error);
      if (axios.isAxiosError(error)) {
        console.error("Response data:", error.response?.data);
        console.error("Response status:", error.response?.status);
      }
      throw new Error("GitHub login failed: " + (error as Error).message);
    }
  });

export const facebookLogin = (req: Request, res: Response) =>
  handleSocialLogin(
    req,
    res,
    async ({ accessToken }: { accessToken: string }) => {
      try {
        // Facebook Graph API를 사용하여 사용자 정보 가져오기
        const userInfoResponse = await axios.get(
          `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`
        );

        const { id: facebookId, name, email, picture } = userInfoResponse.data;

        return createOrUpdateUser({
          username: name,
          email: email || `${facebookId}@facebook.com`,
          password: "",
          full_name: name,
          profile_image_url: picture?.data?.url || "",
          provider: "facebook",
          provider_id: facebookId,
          login_type: "facebook",
          type: "user",
        });
      } catch (error) {
        console.error("Facebook login error:", error);
        throw new Error("Facebook login failed: " + (error as Error).message);
      }
    }
  );

export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token is required" });
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!
    ) as jwt.JwtPayload;
    const user = await userModel.getUserByEmail(decoded.userEmail);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
      user.id!,
      user.email!,
      user.type!
    );

    res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(401).json({ message: "Invalid refresh token" });
  }
};

export const logout = async (req: Request, res: Response) => {
  // 여기서 필요한 경우 DB에서 토큰을 무효화하는 로직을 추가할 수 있습니다.
  // 예: await invalidateToken(req.user.id);
  res.status(200).json({ message: "Logged out successfully" });
};
