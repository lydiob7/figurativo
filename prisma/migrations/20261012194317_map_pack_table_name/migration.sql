/*
  Warnings:

  - You are about to drop the `UserStickerPack` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserStickerPack" DROP CONSTRAINT "UserStickerPack_album_id_fkey";

-- DropForeignKey
ALTER TABLE "UserStickerPack" DROP CONSTRAINT "UserStickerPack_user_id_fkey";

-- DropTable
DROP TABLE "UserStickerPack";

-- CreateTable
CREATE TABLE "user_sticker_pack" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "album_id" INTEGER NOT NULL,
    "opened_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_sticker_pack_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_sticker_pack" ADD CONSTRAINT "user_sticker_pack_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_sticker_pack" ADD CONSTRAINT "user_sticker_pack_album_id_fkey" FOREIGN KEY ("album_id") REFERENCES "album"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
