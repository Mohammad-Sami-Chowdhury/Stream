import { upsertStreamUser } from "../lib/stream.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";

export async function signup(req, res) {
  const { email, password, fullName } = req.body;

  try {
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email already exists, please use a different one" });
    }

    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://api.dicebear.com/7.x/adventurer/svg?seed=${idx}`;
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const codeExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const newUser = await User.create({
      email,
      fullName,
      password,
      profilePic: randomAvatar,
      verificationCode,
      codeExpiresAt,
      verified: false,
    });

    const html = (
      `<table
        width="100%"
        cellpadding="0"
        cellspacing="0"
        style="background: #f5f7fa; padding: 20px"
      >
        <tr>
          <td align="center">
            <table
              width="600"
              cellpadding="0"
              cellspacing="0"
              style="
              background: #ffffff;
              border-radius: 8px;
              overflow: hidden;
              font-family: Arial, sans-serif;
            "
            >
              <tr style="background: #add6ff">
                <td align="center" style="padding: 20px">
                  <img
                    src="https://i.ibb.co/kVHb1YRw/logo.png"
                    alt="Stream"
                    width="120"
                    style="display: block"
                  />
                  <p style="margin: 5px 0; font-weight: bold">STREAM</p>
                </td>
              </tr>

              <tr>
                <td style="padding: 30px; color: #333; font-size: 14px">
                  <p>
                    <strong>${fullName}</strong>
                  </p>
                  <h1 style="text-align: center">Your Verification Code Is</h1>
                  <h2 style="text-align: center">${verificationCode}</h2>
                  <p style="text-align: center">
                    <b> Please do not share this code with anyone. </b>
                  </p>
                </td>
              </tr>

              <tr style="background: #c1dffd">
                <td align="center" style="padding: 20px">
                  <p style="margin: 10px 0">
                    <strong>Stay Safe Stay Secure</strong>
                  </p>
                  <p>
                    <a href="https://facebook.com/chowdhurysami69">
                      <img
                        src="https://img.freepik.com/premium-vector/art-illustration_929495-41.jpg"
                        width="24"
                      />
                    </a>
                    <a href="https://github.com/mohammad-sami-chowdhury">
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/25/25231.png"
                        width="24"
                      />
                    </a>
                    <a href="https://linkedin.com/in/mohammad-sami-chowdhury">
                      <img
                        src="https://static.vecteezy.com/system/resources/previews/018/930/480/large_2x/linkedin-logo-linkedin-icon-transparent-free-png.png"
                        width="24"
                      />
                    </a>
                  </p>
                  <p style="font-size: 12px; color: #777; margin-top: 20px">
                    Developed by Mohammad Sami Chowdhury
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>`
    );
    await sendEmail(email, "Your Stream App OTP Code", html);

    // 🔑 Set JWT cookie even before verification
    const token = jwt.sign(
      { userId: newUser._id, verified: false },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    try {
      await upsertStreamUser({
        id: newUser._id.toString(),
        name: newUser.fullName,
        image: newUser.profilePic || "",
      });
    } catch (error) {
      console.log("Error creating Stream user:", error.message);
    }

    return res.status(201).json({
      success: true,
      message: "Signup successful. Please verify your email.",
      user: newUser,
    });
  } catch (error) {
    console.log("Error in signup controller", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    const isPasswordCorrect = await user.matchPassword(password);
    if (!isPasswordCorrect)
      return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true, // prevent XSS attacks,
      sameSite: "strict", // prevent CSRF attacks
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export function logout(req, res) {
  res.clearCookie("jwt");
  res.status(200).json({ success: true, message: "Logout successful" });
}

export async function onboard(req, res) {
  try {
    const userId = req.user._id;

    const { fullName, bio, nativeLanguage, learningLanguage, location } =
      req.body;

    if (
      !fullName ||
      !bio ||
      !nativeLanguage ||
      !learningLanguage ||
      !location
    ) {
      return res.status(400).json({
        message: "All fields are required",
        missingFields: [
          !fullName && "fullName",
          !bio && "bio",
          !nativeLanguage && "nativeLanguage",
          !learningLanguage && "learningLanguage",
          !location && "location",
        ].filter(Boolean),
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...req.body,
        isOnboarded: true,
      },
      { new: true }
    );

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    try {
      await upsertStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullName,
        image: updatedUser.profilePic || "",
      });
      console.log(
        `Stream user updated after onboarding for ${updatedUser.fullName}`
      );
    } catch (streamError) {
      console.log(
        "Error updating Stream user during onboarding:",
        streamError.message
      );
    }

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Onboarding error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
