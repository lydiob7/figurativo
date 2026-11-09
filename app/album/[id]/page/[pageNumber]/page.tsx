import StickerCard from '@/components/albums/StickerCard'
import prismaClient from '@/prisma/lib/prisma'
import { getUser } from '@/utils/getUser'
import { cn } from 'cn'
import { notFound, redirect } from 'next/navigation'
import { Suspense } from 'react'

async function getAlbumPages(albumId: number, pageNumbers: number[]) {
  const albumPages = await prismaClient.albumPage.findMany({
    where: {
      pageNumber: { in: pageNumbers },
      albumId,
      album: { status: 'PUBLISHED' },
    },
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
  if (!albumPages || albumPages.length < 1) notFound()
  return albumPages
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

  const pageNumberParts = pageNumber.split('-')

  if (
    pageNumberParts.length > 2 ||
    pageNumberParts.some((part) => isNaN(parseInt(part, 10)))
  ) {
    notFound()
  }

  if (pageNumberParts.length === 1 && pageNumberParts[0] !== '1') {
    const page = parseInt(pageNumberParts[0], 10)
    const isPartEven = page % 2 === 0
    if (isPartEven) pageNumberParts.push((page + 1).toString())
    else pageNumberParts.push((page - 1).toString())

    redirect(
      `/album/${id}/page/${pageNumberParts.sort((a, b) => parseInt(a, 10) - parseInt(b, 10)).join('-')}`,
    )
  }

  const albumPages = await getAlbumPages(
    parseInt(id, 10),
    pageNumberParts.map((pageNumber) => parseInt(pageNumber, 10)),
  )

  const allGluedStickers = await getGluedUserStickerCollectionByAlbumId(
    parseInt(id, 10),
  )

  return (
    <div className="grid grid-cols-2">
      {albumPages.map((albumPage) => (
        <div
          className={cn(
            'border border-green-500 p-8',
            albumPage.pageNumber === 1 ? 'col-start-2' : '',
          )}
          key={albumPage.id}
        >
          {!!albumPage.name && (
            <h2 className="font-semibold mb-8 text-xl text-center">
              {albumPage.name}
            </h2>
          )}
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
          <div
            className={cn(
              'mt-8 flex items-center',
              albumPage.pageNumber % 2 === 0 ? '' : 'justify-end',
            )}
          >
            {albumPage.pageNumber}
          </div>
        </div>
      ))}
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
