/*
  Warnings:

  - The primary key for the `user_sticker_collection` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "album" ADD COLUMN     "stickers_per_pack" INTEGER DEFAULT 5;

-- AlterTable
ALTER TABLE "user_sticker_collection" DROP CONSTRAINT "user_sticker_collection_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "user_sticker_collection_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "UserStickerPack" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "album_id" INTEGER NOT NULL,
    "openedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserStickerPack_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserStickerPack" ADD CONSTRAINT "UserStickerPack_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStickerPack" ADD CONSTRAINT "UserStickerPack_album_id_fkey" FOREIGN KEY ("album_id") REFERENCES "album"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
