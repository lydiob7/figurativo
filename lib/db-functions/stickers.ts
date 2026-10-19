import { Rarity } from '@/prisma/generated/prisma/enums'
import prismaClient from '@/prisma/lib/prisma'

export const RARITY_WEIGHTS = {
  [Rarity.COMMON]: 100,
  [Rarity.RARE]: 50,
  [Rarity.EPIC]: 15,
  [Rarity.LEGENDARY]: 5,
}

export async function createRandomUserStickerCollection({
  albumStickers,
  userId,
}: {
  albumStickers: { id: number; rarity: Rarity; probability: number }[]
  userId: number
}) {
  const randomSeed = Math.random()
  let randomStickerId = 0
  let cumulativeProbability = 0

  for (const sticker of albumStickers) {
    cumulativeProbability += sticker.probability
    if (randomSeed < cumulativeProbability) {
      randomStickerId = sticker.id
      break
    }
  }
  const newSticker = await prismaClient.userStickerCollection.create({
    data: {
      userId,
      stickerId: randomStickerId,
    },
    include: {
      sticker: true,
    },
  })

  return newSticker
}
