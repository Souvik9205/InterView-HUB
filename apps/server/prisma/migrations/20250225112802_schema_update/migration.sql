/*
  Warnings:

  - You are about to drop the column `interviewType` on the `Interview` table. All the data in the column will be lost.
  - Made the column `candidateId` on table `Interview` required. This step will fail if there are existing NULL values in that column.
  - Made the column `jobPostId` on table `Interview` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `jobType` to the `JobPost` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Interview" DROP CONSTRAINT "Interview_candidateId_fkey";

-- DropForeignKey
ALTER TABLE "Interview" DROP CONSTRAINT "Interview_jobPostId_fkey";

-- AlterTable
ALTER TABLE "Interview" DROP COLUMN "interviewType",
ALTER COLUMN "candidateId" SET NOT NULL,
ALTER COLUMN "jobPostId" SET NOT NULL;

-- AlterTable
ALTER TABLE "JobPost" ADD COLUMN     "jobType" "InterviewType" NOT NULL;

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_jobPostId_fkey" FOREIGN KEY ("jobPostId") REFERENCES "JobPost"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
