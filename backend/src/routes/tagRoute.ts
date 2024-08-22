import express from "express";
import * as tagController from "../controllers/tagController";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

/**
 * @swagger
 * /api/tags:
 *   get:
 *     summary: Get all tags
 *     tags: [Tags]
 *     responses:
 *       200:
 *         description: List of tags
 *       500:
 *         description: Internal server error
 */
router.get("/", tagController.getAllTags);

/**
 * @swagger
 * /api/tags:
 *   post:
 *     summary: Create a new tag
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created tag
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post("/", authenticateToken, tagController.createTag);

/**
 * @swagger
 * /api/tags/{id}:
 *   put:
 *     summary: Update a tag
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated tag
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Tag not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", authenticateToken, tagController.updateTag);

/**
 * @swagger
 * /api/tags/{id}:
 *   delete:
 *     summary: Delete a tag
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tag deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Tag not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", authenticateToken, tagController.deleteTag);

/**
 * @swagger
 * /api/posts/{postId}/tags:
 *   post:
 *     summary: Add a tag to a post
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tagId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Tag added to post successfully
 *       400:
 *         description: Tag already exists for this post
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post(
  "/posts/:postId/tags",
  authenticateToken,
  tagController.addTagToPost
);

/**
 * @swagger
 * /api/posts/{postId}/tags/{tagId}:
 *   delete:
 *     summary: Remove a tag from a post
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: tagId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tag removed from post successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Tag not found for this post
 *       500:
 *         description: Internal server error
 */
router.delete(
  "/posts/:postId/tags/:tagId",
  authenticateToken,
  tagController.removeTagFromPost
);

export default router;
