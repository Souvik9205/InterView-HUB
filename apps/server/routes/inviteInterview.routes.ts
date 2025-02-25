import { Router } from "express";
import {
  createInterviewInviteController,
  getInterviewInvitesForJobController,
  updateInterviewInviteStatusController,
} from "../controller/inviteinterview.controller";
const inviteRouter = Router();

inviteRouter.post("/add/:jobPostId", createInterviewInviteController);
inviteRouter.get("/:jobPostId", getInterviewInvitesForJobController);
inviteRouter.post("/update/:inviteId", updateInterviewInviteStatusController);

export default inviteRouter;
