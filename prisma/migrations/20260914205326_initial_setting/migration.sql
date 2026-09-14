-- CreateEnum
CREATE TYPE "Status" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateTable
CREATE TABLE "Album" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "coverImgUrl" TEXT,
    "backCoverImgUrl" TEXT,

    CONSTRAINT "Album_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlbumPage" (
    "id" SERIAL NOT NULL,
    "albumId" INTEGER NOT NULL,
    "pageNumber" INTEGER NOT NULL,
    "name" TEXT,
    "firstStickerNumber" INTEGER NOT NULL,
    "lastStickerNumber" INTEGER NOT NULL,

    CONSTRAINT "AlbumPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sticker" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "albumPageId" INTEGER NOT NULL,
    "stickerNumber" INTEGER NOT NULL,
    "status" "Status" NOT NULL,
    "imgUrl" TEXT,
    "description" TEXT,

    CONSTRAINT "Sticker_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AlbumPage_albumId_pageNumber_key" ON "AlbumPage"("albumId", "pageNumber");

-- AddForeignKey
ALTER TABLE "AlbumPage" ADD CONSTRAINT "AlbumPage_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sticker" ADD CONSTRAINT "Sticker_albumPageId_fkey" FOREIGN KEY ("albumPageId") REFERENCES "AlbumPage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
