import StickerCard from '@/components/albums/StickerCard'
import prismaClient from '@/prisma/lib/prisma'
import { getUser } from '@/utils/getUser'

async function getAllMyStickers() {
  const user = await getUser()
  if (!user) throw new Error('Tenes que estar logueado para ver esta pagina')
  return await prismaClient.userStickerCollection.findMany({
    where: { userId: user.id, isGlued: false },
    include: { sticker: true },
    orderBy: { sticker: { stickerNumber: 'asc' } },
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
  return userSticker
}

export default async function MyCollectionPage() {
  const myStickers = await getAllMyStickers()
  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-4 gap-4">
        {myStickers.map((userSticker) => (
          <StickerCard
            key={userSticker.id}
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
