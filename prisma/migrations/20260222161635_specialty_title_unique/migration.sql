/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `specialty` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "specialty_title_key" ON "specialty"("title");

-- CreateIndex
CREATE INDEX "idx_specialty_title" ON "specialty"("title");
