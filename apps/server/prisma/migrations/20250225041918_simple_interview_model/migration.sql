/*
  Warnings:

  - You are about to drop the column `difficulty` on the `Interview` table. All the data in the column will be lost.
  - You are about to drop the column `followUp` on the `Interview` table. All the data in the column will be lost.
  - You are about to drop the column `questionCount` on the `Interview` table. All the data in the column will be lost.
  - You are about to drop the column `topics` on the `Interview` table. All the data in the column will be lost.
  - Made the column `answer` on table `InterviewQA` required. This step will fail if there are existing NULL values in that column.
  - Made the column `order` on table `InterviewQA` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Interview" DROP COLUMN "difficulty",
DROP COLUMN "followUp",
DROP COLUMN "questionCount",
DROP COLUMN "topics";

-- AlterTable
ALTER TABLE "InterviewQA" ALTER COLUMN "answer" SET NOT NULL,
ALTER COLUMN "order" SET NOT NULL;
