/*
  Warnings:

  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Album` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AlbumPage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AlbumPageTemplate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Sticker` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserAlbumCollection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserStickerCollection` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Album" DROP CONSTRAINT "Album_author_id_fkey";

-- DropForeignKey
ALTER TABLE "AlbumPage" DROP CONSTRAINT "AlbumPage_album_id_fkey";

-- DropForeignKey
ALTER TABLE "AlbumPage" DROP CONSTRAINT "AlbumPage_template_id_fkey";

-- DropForeignKey
ALTER TABLE "Sticker" DROP CONSTRAINT "Sticker_album_page_id_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_account_id_fkey";

-- DropForeignKey
ALTER TABLE "UserAlbumCollection" DROP CONSTRAINT "UserAlbumCollection_album_id_fkey";

-- DropForeignKey
ALTER TABLE "UserAlbumCollection" DROP CONSTRAINT "UserAlbumCollection_user_id_fkey";

-- DropForeignKey
ALTER TABLE "UserStickerCollection" DROP CONSTRAINT "UserStickerCollection_sticker_id_fkey";

-- DropForeignKey
ALTER TABLE "UserStickerCollection" DROP CONSTRAINT "UserStickerCollection_user_id_fkey";

-- DropTable
DROP TABLE "Account";

-- DropTable
DROP TABLE "Album";

-- DropTable
DROP TABLE "AlbumPage";

-- DropTable
DROP TABLE "AlbumPageTemplate";

-- DropTable
DROP TABLE "Sticker";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "UserAlbumCollection";

-- DropTable
DROP TABLE "UserStickerCollection";

-- CreateTable
CREATE TABLE "account" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "account_id" INTEGER NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "album" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "cover_img_url" TEXT,
    "back_cover_img_url" TEXT,
    "author_id" INTEGER NOT NULL,

    CONSTRAINT "album_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_album_collection" (
    "user_id" INTEGER NOT NULL,
    "album_id" INTEGER NOT NULL,

    CONSTRAINT "user_album_collection_pkey" PRIMARY KEY ("album_id","user_id")
);

-- CreateTable
CREATE TABLE "album_page_template" (
    "id" SERIAL NOT NULL,
    "sticker_qty" INTEGER NOT NULL,

    CONSTRAINT "album_page_template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "album_page" (
    "id" SERIAL NOT NULL,
    "album_id" INTEGER NOT NULL,
    "page_number" INTEGER NOT NULL,
    "name" TEXT,
    "template_id" INTEGER NOT NULL,

    CONSTRAINT "album_page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sticker" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "album_page_id" INTEGER NOT NULL,
    "sticker_number" INTEGER NOT NULL,
    "status" "Status" NOT NULL,
    "img_url" TEXT,
    "description" TEXT,

    CONSTRAINT "sticker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_sticker_collection" (
    "user_id" INTEGER NOT NULL,
    "sticker_id" INTEGER NOT NULL,
    "is_glued" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user_sticker_collection_pkey" PRIMARY KEY ("user_id","sticker_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_account_id_key" ON "user"("account_id");

-- CreateIndex
CREATE UNIQUE INDEX "album_page_album_id_page_number_key" ON "album_page"("album_id", "page_number");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "album" ADD CONSTRAINT "album_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_album_collection" ADD CONSTRAINT "user_album_collection_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_album_collection" ADD CONSTRAINT "user_album_collection_album_id_fkey" FOREIGN KEY ("album_id") REFERENCES "album"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "album_page" ADD CONSTRAINT "album_page_album_id_fkey" FOREIGN KEY ("album_id") REFERENCES "album"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "album_page" ADD CONSTRAINT "album_page_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "album_page_template"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sticker" ADD CONSTRAINT "sticker_album_page_id_fkey" FOREIGN KEY ("album_page_id") REFERENCES "album_page"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_sticker_collection" ADD CONSTRAINT "user_sticker_collection_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_sticker_collection" ADD CONSTRAINT "user_sticker_collection_sticker_id_fkey" FOREIGN KEY ("sticker_id") REFERENCES "sticker"("id") ON DELETE CASCADE ON UPDATE CASCADE;
