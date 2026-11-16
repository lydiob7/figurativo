import AlbumNavigationArrow from '@/components/albums/AlbumNavigationArrow'
import StickerCard from '@/components/albums/StickerCard'
import {
  getAlbumLastPageNumber,
  getAlbumPages,
} from '@/lib/db-functions/albums'
import { getGluedUserStickerCollectionByAlbumId } from '@/lib/db-functions/stickers'
import { cn } from 'cn'
import { notFound, redirect } from 'next/navigation'
import { Suspense } from 'react'

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

  const lastPageNumber = await getAlbumLastPageNumber(parseInt(id, 10))

  const allGluedStickers = await getGluedUserStickerCollectionByAlbumId(
    parseInt(id, 10),
  )

  return (
    <div className="relative grid grid-cols-2">
      {!albumPages.some((page) => page.pageNumber === 1) && (
        <AlbumNavigationArrow
          direction="left"
          albumId={parseInt(id, 10)}
          albumPageNumbers={albumPages.map((page) => page.pageNumber)}
        />
      )}
      {albumPages.map((albumPage) => (
        <div
          className={cn(
            'relative border border-green-500 p-8 pb-20',
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
              'absolute bottom-8',
              albumPage.pageNumber % 2 === 0 ? 'left-8' : 'right-8',
            )}
          >
            {albumPage.pageNumber}
          </div>
        </div>
      ))}

      {!albumPages.some((page) => page.pageNumber === lastPageNumber) && (
        <AlbumNavigationArrow
          direction="right"
          albumId={parseInt(id, 10)}
          albumPageNumbers={albumPages.map((page) => page.pageNumber)}
          lastPageNumber={lastPageNumber}
        />
      )}
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
