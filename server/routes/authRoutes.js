import { Router } from "express";
import * as auth from "../controllers/authController.js";
import {
  validate,
  registerSchema,
  loginSchema,
} from "../middleware/validation.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const router = Router();
router.post("/register", validate(registerSchema), asyncHandler(auth.register));
router.post("/login", validate(loginSchema), asyncHandler(auth.login));
router.get("/me", asyncHandler(auth.me));
router.post("/logout", auth.logout);
export default router;
