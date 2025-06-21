import express from "express";
import {
  login,
  logout,
  onboard,
  signup,
} from "../controllers/auth.controller.js";
import { resetPassword, sendResetCode, verifyResetCode } from "../controllers/password.reset.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { verifyOtp } from "../controllers/verifyOtp.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/verify-code", verifyOtp);
router.post("/send-reset-code", sendResetCode);
router.post("/verify-reset-code", verifyResetCode)
router.post("/reset-password", resetPassword)

router.post("/onboarding", protectRoute, onboard);

// check if user is logged in
router.get("/me", protectRoute, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

export default router;
