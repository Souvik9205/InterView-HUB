import { Router } from "express";
import {
  addInterviewQAController,
  createInterviewController,
  getJobInterviewController,
  getMockInterviewController,
  getSpecificInterviewController,
} from "../controller/interview.controller";

const interviewRouter = Router();

interviewRouter.post("/create", createInterviewController);
interviewRouter.get("/mock", getMockInterviewController);
interviewRouter.get("/job/:jobId", getJobInterviewController);
interviewRouter.get("/:interviewId", getSpecificInterviewController);
interviewRouter.post(
  "/:interviewId/user/:attendeeId",
  addInterviewQAController
);

export default interviewRouter;
