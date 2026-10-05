import prismaClient from '@/prisma/lib/prisma'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

async function getAlbumPage(albumId: number, pageNumber: number) {
  const albumPage = await prismaClient.albumPage.findFirst({
    where: { pageNumber, albumId, album: { status: 'PUBLISHED' } },
    include: {
      template: true,
      stickers: {
        orderBy: {
          stickerNumber: 'asc',
        },
      },
    },
  })
  if (!albumPage) notFound()
  return albumPage
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
  return (
    <div className="border border-green-500 p-8 rounded-lg" key={albumPage.id}>
      {!!albumPage.name && <h2 className="">{albumPage.name}</h2>}
      <div className="grid gap-4 grid-cols-4">
        {albumPage.stickers?.map((sticker) => (
          <div className="p-4 border border-white rounded-lg" key={sticker.id}>
            {!!sticker.imgUrl && (
              <div className="relative h-40 w-full">
                <Image
                  src={sticker.imgUrl}
                  alt={sticker.name}
                  className="object-contain"
                  fill
                />
              </div>
            )}
            <h3 className="text-center font-semibold text-lg mt-4">
              {sticker.name}
            </h3>
            {!!sticker.description && (
              <p className="text-center tracking-wider">
                {sticker.description}
              </p>
            )}
          </div>
        ))}
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
