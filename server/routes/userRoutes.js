import { Router } from "express";
import * as user from "../controllers/userController.js";
import * as photo from "../controllers/photoController.js";
import { validId } from "../middleware/validation.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const router = Router();
router.get("/", asyncHandler(user.getAll));
router.get("/:id", validId, asyncHandler(user.getOne));
router.get("/:id/photos", validId, asyncHandler(photo.getAll));
export default router;
