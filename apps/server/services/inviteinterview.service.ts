import { decodeToken } from "../utils/decodeToken";
import prisma from "../utils/PrismaClient";
import { InviteStatus } from "@prisma/client";
import crypto from "crypto";

export const createInterviewInviteService = async (
  jobPostId: string,
  ownerId: string,
  email: string
): Promise<{
  status: number;
  data: { message: string; invite?: any };
}> => {
  try {
    const id = decodeToken(ownerId);
    if (!id) {
      return {
        status: 404,
        data: { message: "User not found" },
      };
    }
    const job = await prisma.jobPost.findUnique({ where: { id: jobPostId } });
    if (!job) {
      return {
        status: 404,
        data: { message: "Job post not found" },
      };
    }
    if (job.ownerId !== id) {
      return {
        status: 403,
        data: { message: "You are not authorized to create an invite" },
      };
    }

    const token = crypto.randomBytes(16).toString("hex");
    const invite = await prisma.interviewInvite.create({
      data: {
        jobPostId,
        email,
        token,
        status: InviteStatus.PENDING,
      },
    });
    return {
      status: 200,
      data: {
        message: "Invite created for the job!",
        invite,
      },
    };
  } catch (e) {
    return { status: 500, data: { message: `Internal server error, ${e}` } };
  }
};

export const getInterviewInvitesForJobService = async (
  jobPostId: string,
  ownerId: string
): Promise<{ status: number; data: { message: string; invites?: any[] } }> => {
  try {
    const id = decodeToken(ownerId);
    if (!id) {
      return {
        status: 404,
        data: { message: "User not found" },
      };
    }
    const jobPost = await prisma.jobPost.findUnique({
      where: { id: jobPostId },
    });
    if (!jobPost) {
      return { status: 404, data: { message: "Job post not found" } };
    }
    if (jobPost.ownerId !== id) {
      return {
        status: 403,
        data: { message: "Unauthorized to view invites for this job post" },
      };
    }

    const invites = await prisma.interviewInvite.findMany({
      where: { jobPostId },
      orderBy: { createdAt: "asc" },
    });

    return {
      status: 200,
      data: { message: "Invites retrieved successfully", invites },
    };
  } catch (error) {
    return {
      status: 500,
      data: { message: `Internal server error, ${error}` },
    };
  }
};

export const updateInterviewInviteStatusService = async (
  inviteId: string,
  status: InviteStatus,
  ownerId: string
): Promise<{ status: number; data: { message: string; invite?: any } }> => {
  try {
    const id = decodeToken(ownerId);
    if (!id) {
      return {
        status: 404,
        data: { message: "User not found" },
      };
    }
    const invite = await prisma.interviewInvite.findUnique({
      where: { id: inviteId },
      include: { jobPost: true },
    });
    if (!invite) {
      return { status: 404, data: { message: "Invite not found" } };
    }
    if (invite.jobPost.ownerId !== id) {
      return {
        status: 403,
        data: { message: "Unauthorized to update this invite" },
      };
    }

    const updatedInvite = await prisma.interviewInvite.update({
      where: { id: inviteId },
      data: { status },
    });

    return {
      status: 200,
      data: {
        message: "Invite status updated successfully",
        invite: updatedInvite,
      },
    };
  } catch (error) {
    return {
      status: 500,
      data: { message: `Internal server error, ${error}` },
    };
  }
};
