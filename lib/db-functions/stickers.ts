import {
  Prisma,
  Sticker,
  UserStickerCollection,
} from '@/prisma/generated/prisma/client'
import { Rarity } from '@/prisma/generated/prisma/enums'
import prismaClient from '@/prisma/lib/prisma'
import { getUser } from '@/utils/getUser'
import { revalidatePath } from 'next/cache'

export const RARITY_WEIGHTS = {
  [Rarity.COMMON]: 100,
  [Rarity.RARE]: 50,
  [Rarity.EPIC]: 15,
  [Rarity.LEGENDARY]: 5,
}

type NewSticker = Prisma.UserStickerCollectionGetPayload<{
  include: {
    sticker: true
  }
}>

export type UserStickerCollectionWithCopyIsGlued = UserStickerCollection & {
  copyIsGlued: boolean
  sticker: Sticker
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
  const newSticker: UserStickerCollection & { sticker: Sticker } =
    await prismaClient.userStickerCollection.create({
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

export async function getGluedUserStickerCollectionByAlbumId(albumId: number) {
  const user = await getUser()
  if (!user) return []
  const gluedStickers = await prismaClient.userStickerCollection.findMany({
    where: {
      userId: user.id,
      isGlued: true,
      sticker: { albumPage: { albumId } },
    },
    include: {
      sticker: true,
    },
  })

  return gluedStickers
}

export async function getAllMyStickers(): Promise<
  UserStickerCollectionWithCopyIsGlued[]
> {
  const user = await getUser()
  if (!user) throw new Error('Tenes que estar logueado para ver esta pagina')
  const notGluedUserStickers =
    await prismaClient.userStickerCollection.findMany({
      where: { userId: user.id, isGlued: false },
      include: { sticker: true },
      orderBy: { sticker: { stickerNumber: 'asc' } },
    })

  const notGluedStickerIds = (notGluedUserStickers || [])?.map(
    (userSticker) => userSticker.stickerId,
  )
  const alreadyGluedStickers =
    await prismaClient.userStickerCollection.findMany({
      where: {
        userId: user.id,
        isGlued: true,
        stickerId: { in: notGluedStickerIds },
      },
    })

  return notGluedUserStickers.map((userSticker) => {
    return {
      ...userSticker,
      copyIsGlued: alreadyGluedStickers.some(
        (sticker) => sticker.stickerId === userSticker.stickerId,
      ),
    }
  })
}

export async function glueSticker(userStickerId: number) {
  'use server'
  const user = await getUser()
  if (!user)
    throw new Error('Tenes que estar logueado para poder pegar una figurita')
  const userSticker = await prismaClient.userStickerCollection.update({
    where: { id: userStickerId },
    data: { isGlued: true },
  })
  revalidatePath('/my-collection')
  return userSticker
}
