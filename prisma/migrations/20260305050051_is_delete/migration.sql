/*
  Warnings:

  - You are about to drop the column `isDelete` on the `appointment` table. All the data in the column will be lost.
  - Added the required column `isDeleted` to the `appointment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "appointment" DROP COLUMN "isDelete",
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL;

-- CreateIndex
CREATE INDEX "admin_isDeleted_idx" ON "admin"("isDeleted");

-- CreateIndex
CREATE INDEX "appointment_isDeleted_idx" ON "appointment"("isDeleted");
