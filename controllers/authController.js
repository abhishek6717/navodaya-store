import { hashPassword, comparePassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";

import crypto from "crypto";
import nodemailer from "nodemailer";
import sgTransport from "nodemailer-sendgrid-transport";

const authRegisterController = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    // ---------------- VALIDATION ----------------
    if (!name) {
      return res.status(400).json({ status: false, message: "Username is required" });
    }
    if (!email) {
      return res.status(400).json({ status: false, message: "Email is required" });
    }
    if (!password) {
      return res.status(400).json({ status: false, message: "Password is required" });
    }
    if (!phone) {
      return res.status(400).json({ status: false, message: "Phone number is required" });
    }
    if (!address) {
      return res.status(400).json({ status: false, message: "Address is required" });
    }

    // ---------------- CHECK USER ----------------
    const isexists = await userModel.findOne({ email });
    if (isexists) {
      return res.status(400).json({
        status: false,
        message: "User already exists",
      });
    }

    // ---------------- HASH PASSWORD ----------------
    const hashedPassword = await hashPassword(password);
    if (!hashedPassword) {
      return res.status(500).json({
        status: false,
        message: "Password hashing failed",
      });
    }

    // ---------------- EMAIL TOKEN ----------------
    const emailToken = crypto.randomBytes(32).toString("hex");

    // ---------------- CREATE USER ----------------
    const newUser = await new userModel({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      isVerified: false,
      emailToken,
    }).save();

    // // ---------------- SEND EMAIL ----------------
    // Check if email credentials exist
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('⚠️ Email credentials not configured. Skipping email verification.');
      return res.status(201).json({
        status: true,
        message: "Registration successful. Email verification skipped.",
        user: { name, email },
      });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER.trim(),
        pass: process.env.EMAIL_PASS.trim(),
      },
      tls: {
        rejectUnauthorized: false,
      },
      connectionTimeout: 10000,
      socketTimeout: 10000,
    });

    const verifyLink = `${process.env.CLIENT_URL}/verify-email/${emailToken}`;

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Verify Your Email",
        html: `
          <h2>Hello ${name}</h2>
          <p>Thank you for registering.</p>
          <p>Please verify your email by clicking below:</p>
          <a href="${verifyLink}" style="padding:10px 15px;background:#0d6efd;color:#fff;text-decoration:none;border-radius:5px;">
            Verify Email
          </a>
          <p>If you didn’t register, ignore this email.</p>
        `,
      });
    } catch (emailError) {
      await userModel.findByIdAndDelete(newUser._id);
      throw new Error("Email sending failed: " + emailError.message);
    }

    // ---------------- RESPONSE ----------------
    return res.status(201).json({
      status: true,
      message: "Registration successful. Please verify your email.",
      user: {
        name,
        email,
      },
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


export const verifyEmailController = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await userModel.findOne({ emailToken: token });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification link",
      });
    }

    user.isVerified = true;
    user.emailToken = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Email verification failed",
    });
  }
};

export const authLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ status: false, message: "Email and password are required" });
    }

    // Find user by email
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    // Compare password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ status: false, message: "Invalid credentials" });
    }

    const payload = { _id: user._id};
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
    const expiresAt = new Date().getTime() + 60 * 60 * 1000; // 1 hour in milliseconds
    // If login is successful, return user data (excluding password)
    res.status(200).json({
      status: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        admin: user.isAdmin || false,
        isVerified: user.isVerified,
      },
      token: token,
      expiresAt: expiresAt,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const updateProfileController = async (req, res) => {
  try {
    const userId = req.user && req.user._id;
    if (!userId) return res.status(401).json({ status: false, message: 'Unauthorized' });

    const { name, phone, address, password } = req.body;

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ status: false, message: 'User not found' });

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (password) {
      const hashed = await hashPassword(password);
      if (!hashed) return res.status(500).json({ status: false, message: 'Password hashing failed' });
      user.password = hashed;
    }

    await user.save();

    // return updated user (excluding password)
    return res.status(200).json({
      status: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        admin: user.isAdmin || false,
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({ status: false, message: 'Internal server error', error: error.message });
  }
};

const forgetPasswordController = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    // Validate input
    if (!email) {
      return res.status(400).json({ status: false, message: "Email is required" });
    }
    if (!newPassword) {
      return res.status(400).json({ status: false, message: "New password is required" });
    }

    // Find user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }
    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);
    if (!hashedPassword) {
      return res.status(500).json({ status: false, message: "Password hashing failed" });
    }
    // Update user's password
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({ status: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Error during password reset:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export default { 
  authRegisterController,
  authLoginController, 
  updateProfileController,
  forgetPasswordController,
  verifyEmailController
};