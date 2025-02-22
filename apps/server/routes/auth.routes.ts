import { Router } from "express";
import {
  loginController,
  OTPVerificationController,
  regenerateTokenController,
  signupController,
  tokenVerifyController,
} from "../controller/auth.controller";
const authRouter = Router();

authRouter.post("/login", loginController);
authRouter.post("/signup", signupController);
authRouter.post("/otp-verify", OTPVerificationController);

authRouter.get("/token-verify", tokenVerifyController);
authRouter.get("/regenerate-token", regenerateTokenController);

export default authRouter;
