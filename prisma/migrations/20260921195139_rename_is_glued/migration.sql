/*
  Warnings:

  - You are about to drop the column `isGlued` on the `UserStickerCollection` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserStickerCollection" DROP COLUMN "isGlued",
ADD COLUMN     "is_glued" BOOLEAN NOT NULL DEFAULT false;
