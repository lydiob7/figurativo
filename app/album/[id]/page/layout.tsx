import OpenPackButton from '@/components/albums/OpenPackButton'
import { MAX_STICKERS_PACK_PER_USER_PER_DAY } from '@/constants/album-constants'
import prismaClient from '@/prisma/lib/prisma'
import { getUser } from '@/utils/getUser'
import Link from 'next/link'

async function getRemainingPacksCount() {
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

async function openStickerPack(albumId: number) {
  'use server'
  const user = await getUser()
  const remainingPacks = await getRemainingPacksCount()
  if (remainingPacks < 1)
    throw new Error(
      'Ya abriste todos los paquetes que tenias para abrir en el dia',
    )
  await prismaClient.userStickerPack.create({
    data: {
      userId: user.id,
      albumId,
      openedAt: new Date(),
    },
  })
}

export default async function AlbumPageLayout({
  children,
  params,
}: LayoutProps<'/album/[id]/page'>) {
  const { id: albumId } = await params
  const remainingPacks = await getRemainingPacksCount()

  return (
    <div className="container mx-auto">
      <div className="flex items-center justify-between">
        <Link href={`/album/${albumId}`}>&lt; Volver al album</Link>

        <OpenPackButton
          albumId={parseInt(albumId, 10)}
          remainingPacks={remainingPacks}
          openStickerPack={openStickerPack}
        />
      </div>
      <div>{children}</div>
    </div>
  )
}
