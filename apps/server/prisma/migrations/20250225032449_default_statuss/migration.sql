-- AlterTable
ALTER TABLE "JobPost" ALTER COLUMN "videoRequired" SET DEFAULT false,
ALTER COLUMN "questionType" SET DEFAULT 'AI_GENERATED',
ALTER COLUMN "followUp" SET DEFAULT true,
ALTER COLUMN "totalQuestions" SET DEFAULT 5,
ALTER COLUMN "resumeRequired" SET DEFAULT false;
