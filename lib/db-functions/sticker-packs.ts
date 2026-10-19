import { MAX_STICKERS_PACK_PER_USER_PER_DAY } from '@/constants/album-constants'
import prismaClient from '@/prisma/lib/prisma'
import { getUser } from '@/utils/getUser'
import { createRandomUserStickerCollection, RARITY_WEIGHTS } from './stickers'
import { UserStickerCollection } from '@/prisma/generated/prisma/client'

export async function getRemainingPacksCount() {
  const user = await getUser()
  const today = new Date()?.toISOString().split('T')[0]
  const openedAlbumsToday = await prismaClient.userStickerPack.count({
    where: {
      openedAt: { gt: `${today}T00:00:00.000Z` },
      userId: user.id,
    },
  })
  return MAX_STICKERS_PACK_PER_USER_PER_DAY - openedAlbumsToday
}

export async function openStickerPack(albumId: number) {
  'use server'
  const user = await getUser()
  const remainingPacks = await getRemainingPacksCount()
  if (remainingPacks < 1)
    throw new Error(
      'Ya abriste todos los paquetes que tenias para abrir en el dia',
    )

  const album = await prismaClient.album.findUnique({
    where: { id: albumId },
    select: { id: true, stickersPerPack: true },
  })

  if (!album || !album.id) {
    throw new Error('No existe un album con este id')
  }

  await prismaClient.userStickerPack.create({
    data: {
      userId: user.id,
      albumId: album.id,
      openedAt: new Date(),
    },
  })

  const albumStickers = await prismaClient.sticker.findMany({
    where: { albumPage: { albumId } },
    select: { id: true, rarity: true },
  })

  const stickers: UserStickerCollection[] = []

  const totalAlbumWeights = albumStickers.reduce((acc, sticker) => {
    const stickerWeight = RARITY_WEIGHTS[sticker.rarity]
    return acc + stickerWeight
  }, 0)

  const stickersWithProbability = albumStickers.map((sticker) => {
    const stickerWeight = RARITY_WEIGHTS[sticker.rarity]
    return {
      ...sticker,
      probability: stickerWeight / totalAlbumWeights,
    }
  })

  for (let i = 0; i < album.stickersPerPack; i++) {
    const newSticker = await createRandomUserStickerCollection({
      albumStickers: stickersWithProbability,
      userId: user.id,
    })
    stickers.push(newSticker)
  }

  return stickers
}
