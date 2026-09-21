/*
  Warnings:

  - You are about to drop the column `backCoverImgUrl` on the `Album` table. All the data in the column will be lost.
  - You are about to drop the column `coverImgUrl` on the `Album` table. All the data in the column will be lost.
  - You are about to drop the column `albumId` on the `AlbumPage` table. All the data in the column will be lost.
  - You are about to drop the column `firstStickerNumber` on the `AlbumPage` table. All the data in the column will be lost.
  - You are about to drop the column `lastStickerNumber` on the `AlbumPage` table. All the data in the column will be lost.
  - You are about to drop the column `pageNumber` on the `AlbumPage` table. All the data in the column will be lost.
  - You are about to drop the column `albumPageId` on the `Sticker` table. All the data in the column will be lost.
  - You are about to drop the column `imgUrl` on the `Sticker` table. All the data in the column will be lost.
  - You are about to drop the column `stickerNumber` on the `Sticker` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[album_id,page_number]` on the table `AlbumPage` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `author_id` to the `Album` table without a default value. This is not possible if the table is not empty.
  - Added the required column `album_id` to the `AlbumPage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `page_number` to the `AlbumPage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `template_id` to the `AlbumPage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `album_page_id` to the `Sticker` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sticker_number` to the `Sticker` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AlbumPage" DROP CONSTRAINT "AlbumPage_albumId_fkey";

-- DropForeignKey
ALTER TABLE "Sticker" DROP CONSTRAINT "Sticker_albumPageId_fkey";

-- DropIndex
DROP INDEX "AlbumPage_albumId_pageNumber_key";

-- AlterTable
ALTER TABLE "Album" DROP COLUMN "backCoverImgUrl",
DROP COLUMN "coverImgUrl",
ADD COLUMN     "author_id" INTEGER NOT NULL,
ADD COLUMN     "back_cover_img_url" TEXT,
ADD COLUMN     "cover_img_url" TEXT;

-- AlterTable
ALTER TABLE "AlbumPage" DROP COLUMN "albumId",
DROP COLUMN "firstStickerNumber",
DROP COLUMN "lastStickerNumber",
DROP COLUMN "pageNumber",
ADD COLUMN     "album_id" INTEGER NOT NULL,
ADD COLUMN     "page_number" INTEGER NOT NULL,
ADD COLUMN     "template_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Sticker" DROP COLUMN "albumPageId",
DROP COLUMN "imgUrl",
DROP COLUMN "stickerNumber",
ADD COLUMN     "album_page_id" INTEGER NOT NULL,
ADD COLUMN     "img_url" TEXT,
ADD COLUMN     "sticker_number" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "account_id" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAlbumCollection" (
    "user_id" INTEGER NOT NULL,
    "album_id" INTEGER NOT NULL,

    CONSTRAINT "UserAlbumCollection_pkey" PRIMARY KEY ("album_id","user_id")
);

-- CreateTable
CREATE TABLE "AlbumPageTemplate" (
    "id" SERIAL NOT NULL,
    "sticker_qty" INTEGER NOT NULL,

    CONSTRAINT "AlbumPageTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserStickerCollection" (
    "user_id" INTEGER NOT NULL,
    "sticker_id" INTEGER NOT NULL,
    "isGlued" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserStickerCollection_pkey" PRIMARY KEY ("user_id","sticker_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_account_id_key" ON "User"("account_id");

-- CreateIndex
CREATE UNIQUE INDEX "AlbumPage_album_id_page_number_key" ON "AlbumPage"("album_id", "page_number");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Album" ADD CONSTRAINT "Album_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAlbumCollection" ADD CONSTRAINT "UserAlbumCollection_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAlbumCollection" ADD CONSTRAINT "UserAlbumCollection_album_id_fkey" FOREIGN KEY ("album_id") REFERENCES "Album"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlbumPage" ADD CONSTRAINT "AlbumPage_album_id_fkey" FOREIGN KEY ("album_id") REFERENCES "Album"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlbumPage" ADD CONSTRAINT "AlbumPage_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "AlbumPageTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sticker" ADD CONSTRAINT "Sticker_album_page_id_fkey" FOREIGN KEY ("album_page_id") REFERENCES "AlbumPage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStickerCollection" ADD CONSTRAINT "UserStickerCollection_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStickerCollection" ADD CONSTRAINT "UserStickerCollection_sticker_id_fkey" FOREIGN KEY ("sticker_id") REFERENCES "Sticker"("id") ON DELETE CASCADE ON UPDATE CASCADE;
