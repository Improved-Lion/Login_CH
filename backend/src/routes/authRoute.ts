// src/routes/authRoutes.ts
import express from "express";
import * as authController from "../controllers/authController";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: 신규 유저 등록
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               full_name:
 *                 type: string
 *               profile_image_url:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post("/register", authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: 유저 로그인
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.post("/login", authController.login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: 유저 로그아웃
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout successful
 *       500:
 *         description: Server error
 */
router.post("/logout", authController.logout);

/**
 * @swagger
 * /api/auth/kakao:
 *   post:
 *     summary: 카카오 로그인
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *             properties:
 *               code:
 *                 type: string
 *     responses:
 *       200:
 *         description: Kakao login successful
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post("/kakao", authController.kakaoLogin);
router.post("/refresh", authController.refreshToken);
export default router;
