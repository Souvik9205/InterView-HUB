import { QuestionType as PrismaQuestionType } from "@prisma/client";

export interface successfulAuthResponse {
  status: number;
  data: {
    message: string;
    accessToken: string;
    refreshToken: string;
  };
}

export interface jobCreateData {
  category: string;
  roles: [string];
  videoRequired: boolean;
  questionType: PrismaQuestionType;
  followUp: boolean;
  totalQuestions: number;
  resumeRequired: boolean;
}
