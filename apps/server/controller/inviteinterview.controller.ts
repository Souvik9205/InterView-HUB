import { Request, Response } from "express";
import { InviteStatus } from "@prisma/client";
import {
  createInterviewInviteService,
  getInterviewInvitesForJobService,
  updateInterviewInviteStatusService,
} from "../services/inviteinterview.service";

export const createInterviewInviteController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.headers.authorization?.split(" ")[1];
  const { jobPostId } = req.params;
  const { email } = req.body;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized: user id missing" });
    return;
  }
  if (!jobPostId || !email) {
    res.status(400).json({ message: "Job post id and email are required" });
    return;
  }

  try {
    const result = await createInterviewInviteService(jobPostId, email, userId);
    res.status(result.status).json(result.data);
  } catch (error) {
    console.error("Create invite error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getInterviewInvitesForJobController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.headers.authorization?.split(" ")[1];
  const { jobPostId } = req.params;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized: user id missing" });
    return;
  }
  if (!jobPostId) {
    res.status(400).json({ message: "Job post id is required" });
    return;
  }

  try {
    const result = await getInterviewInvitesForJobService(jobPostId, userId);
    res.status(result.status).json(result.data);
  } catch (error) {
    console.error("Get invites error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateInterviewInviteStatusController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.headers.authorization?.split(" ")[1];
  const { inviteId } = req.params;
  const { status } = req.body; // ("PENDING" or "COMPLETED")

  if (!userId) {
    res.status(401).json({ message: "Unauthorized: user id missing" });
    return;
  }
  if (!inviteId || !status) {
    res.status(400).json({ message: "Invite id and status are required" });
    return;
  }

  if (!Object.values(InviteStatus).includes(status)) {
    res.status(400).json({ message: "Invalid status value" });
    return;
  }

  try {
    const result = await updateInterviewInviteStatusService(
      inviteId,
      status,
      userId
    );
    res.status(result.status).json(result.data);
  } catch (error) {
    console.error("Update invite status error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
