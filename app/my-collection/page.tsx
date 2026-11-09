import StickerCard from '@/components/albums/StickerCard'
import {
  Sticker,
  UserStickerCollection,
} from '@/prisma/generated/prisma/client'
import prismaClient from '@/prisma/lib/prisma'
import { getUser } from '@/utils/getUser'
import { revalidatePath } from 'next/cache'

type UserStickerCollectionWithCopyIsGlued = UserStickerCollection & {
  copyIsGlued: boolean
  sticker: Sticker
}

async function getAllMyStickers(): Promise<
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

async function glueSticker(userStickerId: number) {
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

export default async function MyCollectionPage() {
  const myStickers = await getAllMyStickers()
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl text-center uppercase font-bold">Mi colección</h1>
      <div className="grid grid-cols-4 gap-4 mt-8">
        {myStickers.map((userSticker) => (
          <StickerCard
            key={userSticker.id}
            copyIsGlued={userSticker.copyIsGlued}
            isGlueable
            onGlue={glueSticker}
            sticker={userSticker.sticker}
            userStickerId={userSticker.id}
          />
        ))}
      </div>
    </div>
  )
}
