import { addInterviewQAServiceData } from "../types";
import { decodeToken } from "../utils/decodeToken";
import { generateContent } from "../utils/Gemini.api";
import prisma from "../utils/PrismaClient";

export const createInterviewService = async (
  attendeeId: string,
  jobId: string
): Promise<{
  status: number;
  data: { message: string; interview?: any };
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
      data: {
        message: "Job post not found",
      },
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
          data: {
            message: "Invite not found",
          },
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
        data: {
          message: "Interview created",
          interview,
        },
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
          data: {
            message: "User not found",
          },
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
        data: {
          message: "Interview created",
          interview,
        },
      };
    } else {
      return {
        status: 400,
        data: {
          message: "Invalid job type",
        },
      };
    }
  } catch (e) {
    return {
      status: 500,
      data: {
        message: "Something went wrong",
      },
    };
  }
};

export const getMockInterviewService = async (
  userId: string
): Promise<{
  status: number;
  data: { message: string; Interviews?: any[] };
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
        },
      };
    }
    const interviews = await prisma.interview.findMany({
      where: {
        candidateId: id,
      },
    });
    return {
      status: 200,
      data: {
        message: "Interviews found",
        Interviews: interviews,
      },
    };
  } catch (e) {
    return {
      status: 500,
      data: {
        message: "Something went wrong",
      },
    };
  }
};

export const getJobInterviewService = async (
  userId: string,
  jobId: string
): Promise<{
  status: number;
  data: {
    message: string;
    Interviews?: any[];
  };
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
        data: {
          message: "Job Not Found!",
        },
      };
    }
    if (job.ownerId !== id) {
      return {
        status: 409,
        data: {
          message: "User is not authorised to see the data",
        },
      };
    }
    const interviews = await prisma.interview.findMany({
      where: {
        jobPostId: jobId,
      },
    });

    return {
      status: 200,
      data: {
        message: "Interviews found",
        Interviews: interviews,
      },
    };
  } catch (e) {
    return {
      status: 500,
      data: {
        message: "Something went wrong",
      },
    };
  }
};

export const getSpecificInterviewService = async (
  userId: string,
  interviewId: string
): Promise<{
  status: number;
  data: {
    message: string;
    Interview?: any;
  };
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
        data: {
          message: "Interview not found!",
        },
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
        data: {
          message: "Interview Data fetched!",
          Interview: data,
        },
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
          data: {
            message: "Interview Data fetched!",
            Interview: data,
          },
        };
      } else {
        return {
          status: 409,
          data: {
            message: "You are not authorised to view data!",
          },
        };
      }
    }
  } catch (e) {
    return {
      status: 500,
      data: {
        message: "Something went wrong",
      },
    };
  }
};

export const addInterviewQAService = async (
  attendeeId: string,
  interviewId: string,
  data: addInterviewQAServiceData
): Promise<{
  status: number;
  message: string;
}> => {
  try {
    const interview = await prisma.interview.findUnique({
      where: {
        id: interviewId,
      },
      select: {
        jobPostId: true,
        candidateId: true,
        interviewInviteId: true,
      },
    });
    if (!interview) {
      return {
        status: 404,
        message: "No Interview Found!",
      };
    }
    const job = await prisma.jobPost.findUnique({
      where: {
        id: interview.jobPostId,
      },
      select: {
        jobType: true,
      },
    });
    if (job?.jobType === "JOB") {
      if (interview.interviewInviteId !== attendeeId) {
        return {
          status: 404,
          message: "UnAuthorised",
        };
      }
    } else if (job?.jobType === "MOCK") {
      if (interview.candidateId !== attendeeId) {
        return {
          status: 404,
          message: "UnAuthorised",
        };
      }
    } else {
      return {
        status: 409,
        message: "Wrong Job Type!",
      };
    }

    // AI Validate
    const prompt = `
    Evaluate the following interview Q&A:
    Question: ${data.question}
    Answer: ${data.answer}
    
    Please provide three integer ratings for out of 5:
    - Topic Relevance
    - Fumble
    - Behaviour
    
    Return your answer in the EXACT format:
    Relevance: <number>
    Fumble: <number>
    Behaviour: <number>
    `;

    const evaluationText = await generateContent(prompt);
    const ratingRegex =
      /Relevance:\s*(\d+)[\s\S]*?Fumble:\s*(\d+)[\s\S]*?Behaviour:\s*(\d+)/i;
    const match = evaluationText.match(ratingRegex);
    if (!match) {
      return {
        status: 500,
        message: "AI evaluation went wrong",
      };
    }

    const newRelevanceRating = parseInt(match[1], 10);
    const newFumbleRating = parseInt(match[2], 10);
    const newBehaviourRating = parseInt(match[3], 10);

    const existingEvaluation = await prisma.evaluationData.findUnique({
      where: { interviewId },
    });

    if (existingEvaluation) {
      const oldCount = existingEvaluation.questionCount;
      const newCount = oldCount + 1;

      const aggregatedRelevance = Math.round(
        (existingEvaluation.relevanceRatting * oldCount + newRelevanceRating) /
          newCount
      );
      const aggregatedFumble = Math.round(
        (existingEvaluation.fumbleRatting * oldCount + newFumbleRating) /
          newCount
      );
      const aggregatedBehaviour = Math.round(
        (existingEvaluation.behaviourRatting * oldCount + newBehaviourRating) /
          newCount
      );

      await prisma.evaluationData.update({
        where: { interviewId },
        data: {
          relevanceRatting: aggregatedRelevance,
          fumbleRatting: aggregatedFumble,
          behaviourRatting: aggregatedBehaviour,
          questionCount: newCount,
        },
      });
    } else {
      await prisma.evaluationData.create({
        data: {
          interviewId,
          relevanceRatting: newRelevanceRating,
          fumbleRatting: newFumbleRating,
          behaviourRatting: newBehaviourRating,
          questionCount: 1,
        },
      });
    }

    const existingQACount = await prisma.interviewQA.count({
      where: { interviewId },
    });
    const newOrder = existingQACount + 1;
    await prisma.interviewQA.create({
      data: {
        interviewId,
        question: data.question,
        answer: data.answer,
        order: newOrder,
      },
    });
    return {
      status: 200,
      message: "Interview QA updated!",
    };
  } catch (e) {
    return {
      status: 500,
      message: "Something went wrong",
    };
  }
};
