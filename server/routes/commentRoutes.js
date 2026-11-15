import { Router } from "express";
import { create } from "../controllers/commentController.js";
import { requireLogin } from "../middleware/auth.js";
import { validate, commentSchema } from "../middleware/validation.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const router = Router({ mergeParams: true });
router.post("/", requireLogin, validate(commentSchema), asyncHandler(create));
export default router;
