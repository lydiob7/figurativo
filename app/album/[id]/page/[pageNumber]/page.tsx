import StickerCard from '@/components/albums/StickerCard'
import prismaClient from '@/prisma/lib/prisma'
import { getUser } from '@/utils/getUser'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

async function getAlbumPage(albumId: number, pageNumber: number) {
  const albumPage = await prismaClient.albumPage.findFirst({
    where: { pageNumber, albumId, album: { status: 'PUBLISHED' } },
    include: {
      template: true,
      stickers: {
        select: {
          id: true,
          stickerNumber: true,
        },
        orderBy: {
          stickerNumber: 'asc',
        },
      },
    },
  })
  if (!albumPage) notFound()
  return albumPage
}

async function getGluedUserStickerCollectionByAlbumId(albumId: number) {
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

async function AlbumPageContent({
  params,
}: {
  params: Promise<{ id: string; pageNumber: string }>
}) {
  const { id, pageNumber } = await params

  const albumPage = await getAlbumPage(
    parseInt(id, 10),
    parseInt(pageNumber, 10),
  )

  const allGluedStickers = await getGluedUserStickerCollectionByAlbumId(
    parseInt(id, 10),
  )

  return (
    <div className="border border-green-500 p-8 rounded-lg" key={albumPage.id}>
      {!!albumPage.name && <h2 className="">{albumPage.name}</h2>}
      <div className="grid gap-4 grid-cols-4">
        {albumPage.stickers?.map((sticker) => {
          const gluedSticker = allGluedStickers.find(
            (userSticker) => userSticker.sticker.id === sticker.id,
          )

          return (
            <StickerCard
              key={sticker.id}
              sticker={gluedSticker?.sticker || sticker}
            />
          )
        })}
      </div>
      <div className="mt-8">{albumPage.pageNumber}</div>
    </div>
  )
}

export default async function AlbumPage({
  params,
}: PageProps<'/album/[id]/page/[pageNumber]'>) {
  return (
    <div className="container mx-auto py-12">
      <Suspense fallback={<div>Loading...</div>}>
        <AlbumPageContent params={params} />
      </Suspense>
    </div>
  )
}
