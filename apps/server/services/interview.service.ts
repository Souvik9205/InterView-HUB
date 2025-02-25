import { decodeToken } from "../utils/decodeToken";
import prisma from "../utils/PrismaClient";
export const createInterviewService = async (
  attendeeId: string,
  jobId: string
): Promise<{
  status: number;
  message: string;
  interview?: any;
}> => {
  const job = await prisma.jobPost.findUnique({
    where: { id: jobId },
    select: {
      jobType: true,
    },
  });
  if (!job) {
    return {
      status: 404,
      message: "Job post not found",
    };
  }
  try {
    if (job.jobType === "JOB") {
      const attendee = await prisma.interviewInvite.findFirst({
        where: {
          token: attendeeId,
          jobPostId: jobId,
        },
        select: {
          id: true,
        },
      });
      if (!attendee) {
        return {
          status: 404,
          message: "Invite not found",
        };
      }
      const interview = await prisma.interview.create({
        data: {
          interviewInviteId: attendee.id,
          jobPostId: jobId,
        },
      });
      return {
        status: 200,
        message: "Interview created",
        interview,
      };
    } else if (job.jobType === "MOCK") {
      const id = decodeToken(attendeeId);
      const user = await prisma.user.findUnique({
        where: {
          id,
        },
      });
      if (!user) {
        return {
          status: 404,
          message: "User not found",
        };
      }
      const interview = await prisma.interview.create({
        data: {
          candidateId: id,
          jobPostId: jobId,
        },
      });
      return {
        status: 200,
        message: "Interview created",
        interview,
      };
    } else {
      return {
        status: 400,
        message: "Invalid job type",
      };
    }
  } catch (e) {
    return {
      status: 500,
      message: "Something went wrong",
    };
  }
};

export const getMockInterviewService = async (
  userId: string
): Promise<{
  status: number;
  message: string;
  Interviews?: any[];
}> => {
  try {
    const id = decodeToken(userId);
    const interviews = await prisma.interview.findMany({
      where: {
        candidateId: id,
      },
    });
    return {
      status: 200,
      message: "Interviews found",
      Interviews: interviews,
    };
  } catch (e) {
    return {
      status: 500,
      message: "Something went wrong",
    };
  }
};

export const getJobInterviewService = async (
  userId: string,
  jobId: string
): Promise<{
  status: number;
  message: string;
  Interviews?: any[];
}> => {
  try {
    const id = decodeToken(userId);
    const job = await prisma.jobPost.findUnique({
      where: {
        id: jobId,
      },
      select: {
        ownerId: true,
      },
    });
    if (!job) {
      return {
        status: 404,
        message: "Job Not Found!",
      };
    }
    if (job.ownerId !== id) {
      return {
        status: 409,
        message: "User is not authorised to see the data",
      };
    }
    const interviews = await prisma.interview.findMany({
      where: {
        jobPostId: jobId,
      },
    });

    return {
      status: 200,
      message: "Interviews found",
      Interviews: interviews,
    };
  } catch (e) {
    return {
      status: 500,
      message: "Something went wrong",
    };
  }
};

export const getSpecificInterviewService = async (
  userId: string,
  interviewId: string
): Promise<{
  status: number;
  message: string;
  Interview?: any;
}> => {
  try {
    const id = decodeToken(userId);
    const interview = await prisma.interview.findUnique({
      where: {
        id: interviewId,
      },
      select: {
        candidateId: true,
        jobPostId: true,
      },
    });
    if (!interview) {
      return {
        status: 404,
        message: "Interview not found!",
      };
    }

    if (interview.candidateId === id) {
      const data = await prisma.interview.findUnique({
        where: {
          id: interviewId,
        },
      });
      return {
        status: 200,
        message: "Interview Data fetched!",
        Interview: data,
      };
    } else {
      const job = await prisma.jobPost.findFirst({
        where: {
          id: interview.jobPostId,
        },
        select: {
          ownerId: true,
        },
      });
      if (job?.ownerId === id) {
        const data = await prisma.interview.findUnique({
          where: {
            id: interviewId,
          },
        });
        return {
          status: 200,
          message: "Interview Data fetched!",
          Interview: data,
        };
      } else {
        return {
          status: 409,
          message: "You are not authorised to view data!",
        };
      }
    }
  } catch (e) {
    return {
      status: 500,
      message: "Something went wrong",
    };
  }
};

//post data entry
