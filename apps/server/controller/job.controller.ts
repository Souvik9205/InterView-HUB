import { Request, Response } from "express";
import {
  jobCreateService,
  jobUpdateService,
  getUserJobPostsService,
  getJobPostService,
  deleteJobPostService,
  addJobPostQuestionsService,
  updateJobPostQuestionService,
} from "../services/job.service";

export const jobCreateController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.headers.authorization?.split(" ")[1];
  if (!userId) {
    res.status(401).json({ message: "Unauthorized: user id missing" });
    return;
  }
  const {
    category,
    roles,
    videoRequired,
    questionType,
    followUp,
    totalQuestions,
    resumeRequired,
    jobType,
  } = req.body;
  const data = {
    category,
    roles,
    videoRequired,
    questionType,
    followUp,
    totalQuestions,
    resumeRequired,
    jobType,
  };
  if (!category || !roles || !jobType) {
    res
      .status(400)
      .json({
        message: "Missing required fields category, job type and roles",
      });
    return;
  }

  if (!userId) {
    res.status(401).json({ message: "Unauthorized: user id missing" });
    return;
  }

  try {
    const result = await jobCreateService(data, userId);
    res.status(result.status).json(result.data);
  } catch (error) {
    console.error("Job creation error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const jobUpdateController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.headers.authorization?.split(" ")[1];
  const { jobId } = req.params;
  if (!userId) {
    res.status(401).json({ message: "Unauthorized: user id missing" });
    return;
  }
  if (!jobId) {
    res.status(400).json({ message: "Job id is required" });
    return;
  }

  const data = req.body;

  try {
    const result = await jobUpdateService(jobId, data, userId);
    res.status(result.status).json(result.data);
  } catch (error) {
    console.error("Job update error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserJobPostsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.headers.authorization?.split(" ")[1];
  if (!userId) {
    res.status(401).json({ message: "Unauthorized: user id missing" });
    return;
  }
  try {
    const result = await getUserJobPostsService(userId);
    res.status(result.status).json(result.data);
  } catch (error) {
    console.error("Get user job posts error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getJobPostController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.headers.authorization?.split(" ")[1];
  if (!userId) {
    res.status(401).json({ message: "Unauthorized: user id missing" });
    return;
  }
  const { jobId } = req.params;
  if (!jobId) {
    res.status(400).json({ message: "Job id is required" });
    return;
  }
  try {
    const result = await getJobPostService(userId, jobId);
    res.status(result.status).json(result.data);
  } catch (error) {
    console.error("Get job post error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteJobPostController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.headers.authorization?.split(" ")[1];
  const { jobId } = req.params;
  if (!userId) {
    res.status(401).json({ message: "Unauthorized: user id missing" });
    return;
  }
  if (!jobId) {
    res.status(400).json({ message: "Job id is required" });
    return;
  }
  try {
    const result = await deleteJobPostService(jobId, userId);
    res.status(result.status).json(result.data);
  } catch (error) {
    console.error("Delete job post error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const addJobPostQuestionsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.headers.authorization?.split(" ")[1];
  const { jobId } = req.params;
  const { questions } = req.body;
  // Expected format: [{ question: string, order: number }, ...]

  if (!userId) {
    res.status(401).json({ message: "Unauthorized: user id missing" });
    return;
  }
  if (!jobId) {
    res.status(400).json({ message: "Job id is required" });
    return;
  }
  if (!questions || !Array.isArray(questions)) {
    res.status(400).json({ message: "Questions must be provided as an array" });
    return;
  }
  try {
    const result = await addJobPostQuestionsService(jobId, questions, userId);
    res.status(result.status).json(result.data);
  } catch (error) {
    console.error("Add job post questions error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateJobPostQuestionController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.headers.authorization?.split(" ")[1];
  const { questionId } = req.params;
  if (!userId) {
    res.status(401).json({ message: "Unauthorized: user id missing" });
    return;
  }
  if (!questionId) {
    res.status(400).json({ message: "Question id is required" });
    return;
  }

  const data = req.body;
  // Expected to contain updated 'question' and/or 'order'
  try {
    const result = await updateJobPostQuestionService(questionId, data, userId);
    res.status(result.status).json(result.data);
  } catch (error) {
    console.error("Update job post question error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
