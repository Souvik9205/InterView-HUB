/*
  Warnings:

  - You are about to drop the column `userEmail` on the `Otp` table. All the data in the column will be lost.
  - Added the required column `email` to the `Otp` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Otp" DROP CONSTRAINT "Otp_userEmail_fkey";

-- AlterTable
ALTER TABLE "Otp" DROP COLUMN "userEmail",
ADD COLUMN     "email" TEXT NOT NULL;
