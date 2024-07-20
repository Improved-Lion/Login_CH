import express from "express";
import * as userController from "../controllers/userController";

const router = express.Router();

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: 현재 로그인한 유저 정보 조회
 *     tags: [Users]
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
router.get("/me", userController.getUserInfo);

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

export default router;
