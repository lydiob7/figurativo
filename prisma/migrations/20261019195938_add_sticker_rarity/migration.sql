-- CreateEnum
CREATE TYPE "Rarity" AS ENUM ('COMMON', 'RARE', 'EPIC', 'LEGENDARY');

-- AlterTable
ALTER TABLE "sticker" ADD COLUMN     "rarity" "Rarity" DEFAULT 'COMMON';
