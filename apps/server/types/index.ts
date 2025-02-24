export interface successfulAuthResponse {
  status: number;
  data: {
    message: string;
    accessToken: string;
    refreshToken: string;
  };
}
export enum QuestionType {
  HARDCODED,
  AI_GENERATED,
}
export interface jobCreateData {
  category: string;
  roles: [string];
  videoRequired: boolean;
  questionType: QuestionType;
  followUp: boolean;
  totalQuestions: number;
  resumeRequired: boolean;
}
