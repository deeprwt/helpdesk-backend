/*
  Warnings:

  - Added the required column `createdByEmail` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdByName` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Ticket" ADD COLUMN     "createdByEmail" TEXT NOT NULL,
ADD COLUMN     "createdByName" TEXT NOT NULL;
