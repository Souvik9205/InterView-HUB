import { Router } from "express";
import {
  getPublicUserController,
  getUserController,
} from "../controller/user.controller";

const userRouter = Router();

userRouter.get("/", getUserController);
userRouter.get("/:userEmail", getPublicUserController);

export default userRouter;
