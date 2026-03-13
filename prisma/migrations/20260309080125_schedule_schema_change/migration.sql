/*
  Warnings:

  - You are about to drop the column `endDate` on the `schedule` table. All the data in the column will be lost.
  - You are about to drop the column `endTime` on the `schedule` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `schedule` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `schedule` table. All the data in the column will be lost.
  - Added the required column `endDateTime` to the `schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDateTime` to the `schedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "schedule" DROP COLUMN "endDate",
DROP COLUMN "endTime",
DROP COLUMN "startDate",
DROP COLUMN "startTime",
ADD COLUMN     "endDateTime" TEXT NOT NULL,
ADD COLUMN     "startDateTime" TEXT NOT NULL;
