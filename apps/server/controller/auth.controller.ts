import { Request, Response } from "express";
import {
  loginService,
  signUpService,
  refreshTokenService,
  OTPVerificationService,
} from "../services/auth.service";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../utils/Secret";

export const loginController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required" });
    return;
  }

  try {
    const result = await loginService(email, password);
    res.status(result.status).json(result.data);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const signupController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ message: "Email is required" });
    return;
  }

  try {
    const result = await signUpService(email);
    res.status(result.status).json(result.message);
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const OTPVerificationController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, otp, imgURL, password, name } = req.body;

  if (!email || !otp || !name || !password) {
    res
      .status(400)
      .json({ message: "Email, name, password and otp are required" });
    return;
  }

  try {
    const result = await OTPVerificationService(
      email,
      otp,
      password,
      name,
      imgURL
    );
    res.status(result.status).json(result.data);
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const regenerateTokenController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const refreshToken = req.headers.authorization?.split(" ")[1];
  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  try {
    const result = await refreshTokenService(refreshToken);
    res.status(result.status).json({ accessToken: result.accessToken });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const tokenVerifyController = async (
  req: Request,
  res: Response
): Promise<any> => {
  const refreshToken = req.headers.authorization?.split(" ")[1];
  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  try {
    jwt.verify(refreshToken, process.env.JWT_SECRET || JWT_SECRET);
    res.status(200).json({ valid: true });
  } catch (error) {
    res.status(400).json({ valid: false, message: "Invalid or expired token" });
  }
};
