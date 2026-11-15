import { Router } from "express";
import * as photo from "../controllers/photoController.js";
import commentRoutes from "./commentRoutes.js";
import { requireLogin } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { validate, photoSchema, validId } from "../middleware/validation.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const router = Router();
router.get("/", asyncHandler(photo.getAll));
router.post(
  "/",
  requireLogin,
  upload.single("image"),
  validate(photoSchema),
  asyncHandler(photo.create)
);
router.use("/:id/comments", validId, commentRoutes);
router.put("/:id/like", validId, requireLogin, asyncHandler(photo.setLike));
router.delete("/:id/like", validId, requireLogin, asyncHandler(photo.setLike));
router.get("/:id", validId, asyncHandler(photo.getOne));
router.delete("/:id", validId, requireLogin, asyncHandler(photo.remove));
export default router;
