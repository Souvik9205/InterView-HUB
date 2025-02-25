/*
  Warnings:

  - You are about to drop the column `evaluationData` on the `Interview` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Interview" DROP COLUMN "evaluationData",
ADD COLUMN     "feedback" TEXT;

-- CreateTable
CREATE TABLE "EvaluationData" (
    "id" TEXT NOT NULL,
    "interviewId" TEXT NOT NULL,
    "relevanceRatting" INTEGER NOT NULL DEFAULT 0,
    "fumbleRatting" INTEGER NOT NULL DEFAULT 0,
    "behaviourRatting" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "EvaluationData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EvaluationData_interviewId_key" ON "EvaluationData"("interviewId");

-- AddForeignKey
ALTER TABLE "EvaluationData" ADD CONSTRAINT "EvaluationData_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "Interview"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
