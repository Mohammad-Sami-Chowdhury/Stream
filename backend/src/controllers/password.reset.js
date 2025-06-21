import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";
import bcrypt from "bcryptjs";

export async function sendResetCode(req, res) {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const codeExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

  user.resetCode = resetCode;
  user.resetCodeExpiresAt = codeExpiresAt;
  await user.save();

  const html = `<table
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
                </td>
              </tr>
              <tr>
                <td style="padding: 30px; color: #333; font-size: 14px">
                  <h1 style="text-align: center">Your Password Rest Code Is</h1>
                  <h2 style="text-align: center">${resetCode}</h2>
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
      </table>`;

  await sendEmail(email, "Your Reset Code", html);
  res.json({ message: "Reset code sent to email" });
}

export async function verifyResetCode(req, res) {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ message: "Email and code are required" });
    }

    const user = await User.findOne({
      email,
      resetCode: code,
      resetCodeExpiresAt: { $gt: new Date() }, // code not expired
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }

    // Optionally clear the resetCode after successful verification
    user.resetCode = null;
    user.resetCodeExpiresAt = null;
    await user.save();

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error verifying reset code:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function resetPassword(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.password = password;

    user.resetCode = null;
    user.resetCodeExpiresAt = null;

    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
