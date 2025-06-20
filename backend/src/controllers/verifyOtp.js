import User from "../models/User.js"; // ✅ Capitalized model name
import jwt from "jsonwebtoken";

export async function verifyOtp(req, res) {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res
        .status(400)
        .json({ message: "Email and verification code are required" });
    }

    const user = await User.findOne({
      email,
      verificationCode: String(code), // ✅ IMPORTANT: Ensure it's compared as string
      codeExpiresAt: { $gt: new Date() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification code" });
    }

    user.verified = true;
    user.verificationCode = null;
    user.codeExpiresAt = null;
    await user.save();

    const token = jwt.sign(
      { userId: user._id, verified: true },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    return res
      .status(200)
      .json({ success: true, message: "Email verified successfully", token });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
