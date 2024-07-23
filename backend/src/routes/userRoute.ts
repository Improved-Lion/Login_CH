// src/routes/userRoutes.ts
import express from "express";
import * as userController from "../controllers/userController";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: 현재 로그인한 유저 정보 조회
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 full_name:
 *                   type: string
 *                 profile_image_url:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get("/me", authenticateToken, userController.getUserInfo);

/**
 * @swagger
 * /api/users/{userEmail}:
 *   get:
 *     summary: 특정 유저 정보 조회
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userEmail
 *         required: true
 *         schema:
 *           type: string
 *         description: 조회할 유저의 이메일
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 full_name:
 *                   type: string
 *                 profile_image_url:
 *                   type: string
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get("/:userEmail", userController.getUserByEmail);

/**
 * @swagger
 * /api/users/send-verification-code:
 *   post:
 *     summary: 비밀번호 재설정을 위한 인증 코드 전송
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Verification code sent successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.post("/send-verification-code", userController.sendVerificationCode);

/**
 * @swagger
 * /api/users/verify-code:
 *   post:
 *     summary: 인증 코드 확인
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               verificationCode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Verification code is valid
 *       400:
 *         description: Invalid verification code
 *       500:
 *         description: Server error
 */
router.post("/verify-code", userController.verifyCode);

export default router;
