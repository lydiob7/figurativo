/*
  Warnings:

  - Made the column `stickers_per_pack` on table `album` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "album" ALTER COLUMN "stickers_per_pack" SET NOT NULL;
