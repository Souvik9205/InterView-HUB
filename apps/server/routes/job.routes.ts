import { Router } from "express";
import {
  addJobPostQuestionsController,
  deleteJobPostController,
  getJobPostController,
  getUserJobPostsController,
  jobCreateController,
  jobUpdateController,
  updateJobPostQuestionController,
} from "../controller/job.controller";
const jobRouter = Router();

jobRouter.post("/create", jobCreateController);
jobRouter.post("/update/:jobId", jobUpdateController);
jobRouter.get("/get", getUserJobPostsController);
jobRouter.get("/get/:jobId", getJobPostController);
jobRouter.delete("/delete/:jobId", deleteJobPostController);
jobRouter.post("/add-questions/:jobId", addJobPostQuestionsController);
jobRouter.post("/update-question/:questionId", updateJobPostQuestionController);

export default jobRouter;
