import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/db";
import Admin from "@/models/admin/Admin";
import { generateToken, setAuthToken } from "@/lib/auth";
import { sendMail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { username, password, otp } = await req.json();

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    // Find admin
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // If OTP is provided, perform OTP verification
    if (otp) {
      // For extra security, verify the password again if it is provided
      if (password) {
        const isPasswordValid = await admin.comparePassword(password);
        if (!isPasswordValid) {
          return NextResponse.json(
            { error: "Invalid credentials" },
            { status: 401 }
          );
        }
      }

      // Check if OTP matches and is not expired
      if (!admin.otp || !admin.otpExpiresAt || new Date() > admin.otpExpiresAt) {
        return NextResponse.json(
          { error: "Verification code has expired or is invalid. Please request a new one." },
          { status: 401 }
        );
      }

      if (admin.otp !== otp) {
        return NextResponse.json(
          { error: "Invalid verification code." },
          { status: 401 }
        );
      }

      // Clear OTP details upon successful verification
      admin.otp = undefined;
      admin.otpExpiresAt = undefined;
      await admin.save();

      // Generate token
      const token = generateToken({
        userId: admin._id.toString(),
        username: admin.username,
        role: admin.role,
      });

      // Set cookie
      await setAuthToken(token);

      // Force Next.js to revalidate the admin routes
      revalidatePath("/admin", "layout");

      return NextResponse.json({
        success: true,
        mfaRequired: false,
        data: {
          id: admin._id,
          username: admin.username,
          role: admin.role,
        },
      });
    }

    // If OTP is NOT provided, verify password and send OTP (Stage 1)
    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    // Check password
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Determine verification email
    const email = admin.email || process.env.ADMIN_MFA_EMAIL;
    if (!email) {
      return NextResponse.json(
        { error: "No MFA email address is configured for this admin account." },
        { status: 400 }
      );
    }

    // Generate secure 6-digit OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP in database with 5-minute expiration
    admin.otp = generatedOtp;
    admin.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
    await admin.save();

    // Send the verification code via email
    const emailResponse = await sendMail({
      to: email,
      subject: "enteropia Admin Login Verification Code",
      html: `
        <div style="font-family: sans-serif; background-color: #140620; color: #ffffff; padding: 30px; border-radius: 12px; max-width: 500px; margin: auto; border: 1px solid rgba(163, 86, 219, 0.2);">
          <h2 style="color: #a356db; text-align: center; margin-bottom: 20px;">enteropia Admin Portal</h2>
          <p>Hello,</p>
          <p>We received a request to log in to the enteropia Admin Console. Please use the following One-Time Password (OTP) to complete your verification:</p>
          <div style="background-color: #221035; border: 1px solid rgba(163, 86, 219, 0.3); border-radius: 8px; padding: 15px; text-align: center; font-size: 28px; font-weight: bold; letter-spacing: 6px; color: #ffffff; margin: 25px 0;">
            ${generatedOtp}
          </div>
          <p style="font-size: 13px; color: rgba(255, 255, 255, 0.6); text-align: center;">This verification code is valid for 5 minutes. Do not share this code with anyone.</p>
          <hr style="border: 0; border-top: 1px solid rgba(163, 86, 219, 0.1); margin: 25px 0;">
          <p style="font-size: 11px; color: rgba(255, 255, 255, 0.4); text-align: center; margin: 0;">This is an automated security message. Please do not reply to this email.</p>
        </div>
      `,
    });

    if (!emailResponse.success) {
      console.error("MFA OTP Email sending failed:", emailResponse.error);
      return NextResponse.json(
        { error: `Failed to send verification email: ${emailResponse.error}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      mfaRequired: true,
      username: admin.username,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}