import { Request, Response } from "express";
import {
  addInterviewQAService,
  createInterviewService,
  getJobInterviewService,
  getMockInterviewService,
  getSpecificInterviewService,
} from "../services/interview.service";

export const createInterviewController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { attendeeId, jobId } = req.body;
  if (!attendeeId || !jobId) {
    res.status(400).json({ message: "Attendee id and job id are required" });
    return;
  }
  try {
    const result = await createInterviewService(attendeeId, jobId);
    res.status(result.status).json(result.data);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getMockInterviewController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.headers.authorization?.split(" ")[1];
  if (!userId) {
    res.status(401).json({ message: "Unauthorized: user id missing" });
    return;
  }
  try {
    const result = await getMockInterviewService(userId);
    res.status(result.status).json(result.data);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getJobInterviewController = async (
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
    const result = await getJobInterviewService(userId, jobId);
    res.status(result.status).json(result.data);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getSpecificInterviewController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.headers.authorization?.split(" ")[1];
  const { interviewId } = req.params;
  if (!userId) {
    res.status(401).json({ message: "Unauthorized: user id missing" });
    return;
  }
  if (!interviewId) {
    res.status(400).json({ message: "Job id is required" });
    return;
  }
  try {
    const result = await getSpecificInterviewService(userId, interviewId);
    res.status(result.status).json(result.data);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};

export const addInterviewQAController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { interviewId, attendeeId } = req.params;
  const { question, answer } = req.body;
  if (!interviewId || !attendeeId) {
    res
      .status(401)
      .json({ message: "Unauthorized: attendee id or interview Id missing" });
    return;
  }
  const data = {
    question,
    answer,
  };
  try {
    const result = await addInterviewQAService(interviewId, attendeeId, data);
    res.status(result.status).json(result.message);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};
