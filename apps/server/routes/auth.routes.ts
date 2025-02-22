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
authRouter.post("/token-verify", tokenVerifyController);
authRouter.post("/regenerate-token", regenerateTokenController);
authRouter.post("/otp-verify", OTPVerificationController);

export default authRouter;
