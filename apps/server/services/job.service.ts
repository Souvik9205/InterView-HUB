import { jobCreateData } from "../types";
import { decodeToken } from "../utils/decodeToken";
import prisma from "../utils/PrismaClient";

export const jobCreateService = async (
  data: jobCreateData,
  userId: string
): Promise<{
  status: number;
  data: {
    message: string;
    job: any;
  };
}> => {
  try {
    const id = decodeToken(userId);
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      return {
        status: 404,
        data: {
          message: "User not found",
          job: null,
        },
      };
    }
    const job = await prisma.jobPost.create({
      data: {
        ownerId: id,
        category: data.category,
        roles: data.roles,
        videoRequired: data.videoRequired,
        questionType: data.questionType,
        followUp: data.followUp,
        totalQuestions: data.totalQuestions,
        resumeRequired: data.resumeRequired,
        jobType: data.jobType,
      },
      select: {
        id: true,
        category: true,
        owner: true,
        createdAt: true,
      },
    });
    return {
      status: 200,
      data: {
        message: "Job created successfully",
        job: job,
      },
    };
  } catch (error) {
    return {
      status: 500,
      data: {
        message: `Internal server error, ${error}`,
        job: null,
      },
    };
  }
};

export const jobUpdateService = async (
  jobId: string,
  data: Partial<jobCreateData>,
  userId: string
): Promise<{
  status: number;
  data: { message: string; job: any };
}> => {
  try {
    const id = decodeToken(userId);
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      return {
        status: 404,
        data: { message: "User not found", job: null },
      };
    }
    const job = await prisma.jobPost.findUnique({ where: { id: jobId } });
    if (!job) {
      return {
        status: 404,
        data: { message: "Job post not found", job: null },
      };
    }

    if (job.ownerId !== id) {
      return {
        status: 403,
        data: { message: "Unauthorized to update this job post", job: null },
      };
    }

    const updatedJob = await prisma.jobPost.update({
      where: { id: jobId },
      data: { ...data },
      select: {
        id: true,
        category: true,
        roles: true,
        videoRequired: true,
        questionType: true,
        followUp: true,
        totalQuestions: true,
        resumeRequired: true,
        updatedAt: true,
      },
    });

    return {
      status: 200,
      data: { message: "Job updated successfully", job: updatedJob },
    };
  } catch (error) {
    return {
      status: 500,
      data: { message: `Internal server error, ${error}`, job: null },
    };
  }
};

export const getUserJobPostsService = async (
  userId: string
): Promise<{
  status: number;
  data: { message: string; jobs: any[] };
}> => {
  try {
    const id = decodeToken(userId);
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      return {
        status: 404,
        data: { message: "User not found", jobs: [] },
      };
    }
    const jobs = await prisma.jobPost.findMany({
      where: { ownerId: id },
      select: {
        id: true,
        category: true,
        roles: true,
        videoRequired: true,
        questionType: true,
        followUp: true,
        totalQuestions: true,
        resumeRequired: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return {
      status: 200,
      data: { message: "Job posts retrieved successfully", jobs },
    };
  } catch (error) {
    return {
      status: 500,
      data: { message: `Internal server error, ${error}`, jobs: [] },
    };
  }
};

export const getJobPostService = async (
  userId: string,
  jobId: string
): Promise<{
  status: number;
  data: { message: string; job: any };
}> => {
  try {
    const id = decodeToken(userId);
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      return {
        status: 404,
        data: { message: "User not found", job: null },
      };
    }
    const job = await prisma.jobPost.findUnique({
      where: { id: jobId },
      include: {
        owner: true,
        jobQuestions: true,
        invites: true,
        interviews: true,
      },
    });
    if (!job) {
      return {
        status: 404,
        data: { message: "Job post not found", job: null },
      };
    }
    return {
      status: 200,
      data: { message: "Job post retrieved successfully", job },
    };
  } catch (error) {
    return {
      status: 500,
      data: { message: `Internal server error, ${error}`, job: null },
    };
  }
};

export const deleteJobPostService = async (
  jobId: string,
  userId: string
): Promise<{
  status: number;
  data: { message: string };
}> => {
  try {
    const id = decodeToken(userId);
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      return {
        status: 404,
        data: { message: "User not found" },
      };
    }
    const job = await prisma.jobPost.findUnique({ where: { id: jobId } });
    if (!job) {
      return {
        status: 404,
        data: { message: "Job post not found" },
      };
    }
    if (job.ownerId !== id) {
      return {
        status: 403,
        data: { message: "Unauthorized to delete this job post" },
      };
    }
    await prisma.jobPost.delete({ where: { id: jobId } });
    return {
      status: 200,
      data: { message: "Job post deleted successfully" },
    };
  } catch (error) {
    return {
      status: 500,
      data: { message: `Internal server error, ${error}` },
    };
  }
};

export const addJobPostQuestionsService = async (
  jobId: string,
  questions: { question: string; order: number }[],
  userId: string
): Promise<{
  status: number;
  data: { message: string; jobQuestions?: any[] };
}> => {
  try {
    const id = decodeToken(userId);
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      return {
        status: 404,
        data: { message: "User not found" },
      };
    }
    const job = await prisma.jobPost.findUnique({ where: { id: jobId } });
    if (!job) {
      return {
        status: 404,
        data: { message: "Job post not found" },
      };
    }
    if (job.ownerId !== id) {
      return {
        status: 403,
        data: { message: "Unauthorized to add questions to this job post" },
      };
    }

    await prisma.jobQuestion.createMany({
      data: questions.map((q) => ({
        jobPostId: jobId,
        question: q.question,
        order: q.order,
      })),
    });

    const jobQuestions = await prisma.jobQuestion.findMany({
      where: { jobPostId: jobId },
      orderBy: { order: "asc" },
    });

    return {
      status: 200,
      data: {
        message: "Questions added successfully",
        jobQuestions,
      },
    };
  } catch (error) {
    return {
      status: 500,
      data: { message: `Internal server error, ${error}` },
    };
  }
};

export const updateJobPostQuestionService = async (
  questionId: string,
  data: { question?: string; order?: number },
  userId: string
): Promise<{
  status: number;
  data: { message: string; jobQuestion?: any };
}> => {
  try {
    const id = decodeToken(userId);
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      return {
        status: 404,
        data: { message: "User not found" },
      };
    }
    const jobQuestion = await prisma.jobQuestion.findUnique({
      where: { id: questionId },
      include: { jobPost: true },
    });
    if (!jobQuestion) {
      return {
        status: 404,
        data: { message: "Job question not found" },
      };
    }
    if (jobQuestion.jobPost.ownerId !== id) {
      return {
        status: 403,
        data: { message: "Unauthorized to update this question" },
      };
    }
    const updatedQuestion = await prisma.jobQuestion.update({
      where: { id: questionId },
      data,
    });
    return {
      status: 200,
      data: {
        message: "Question updated successfully",
        jobQuestion: updatedQuestion,
      },
    };
  } catch (error) {
    return {
      status: 500,
      data: { message: `Internal server error, ${error}` },
    };
  }
};
