/*
  Warnings:

  - Made the column `rarity` on table `sticker` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "sticker" ALTER COLUMN "rarity" SET NOT NULL;
