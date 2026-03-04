/*
  Warnings:

  - A unique constraint covering the columns `[doctorId,specialtyId]` on the table `doctor_specialty` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "doctor_specialty_specialtyId_idx" ON "doctor_specialty"("specialtyId");

-- CreateIndex
CREATE UNIQUE INDEX "doctor_specialty_doctorId_specialtyId_key" ON "doctor_specialty"("doctorId", "specialtyId");
