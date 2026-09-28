import prismaClient from '@/prisma/lib/prisma'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

async function getAlbum(id: number) {
  const album = await prismaClient.album.findUnique({
    where: { id, status: 'PUBLISHED' },
    include: {
      pages: true,
    },
  })
  if (!album) notFound()
  return album
}

export default async function Album({ params }: PageProps<'/album/[id]'>) {
  return (
    <div className="container mx-auto py-12">
      <Suspense fallback={<div>Loading...</div>}>
        {params.then(async ({ id }) => {
          const album = await getAlbum(parseInt(id, 10))
          return (
            <div>
              <h1 className="text-3xl text-center uppercase font-bold">
                {album.name}
              </h1>

              <div className="grid grid-cols-4 gap-4 mt-8">
                {album.pages?.map((page) => (
                  <Link
                    href={`/album/${album.id}/page/${page.pageNumber}`}
                    key={page.id}
                  >
                    <div className="border border-green-500 p-8 rounded-lg">
                      <div className="text-2xl font-bold">
                        Página {page.pageNumber}
                      </div>

                      {!!page.name && <h2 className="mt-4">{page.name}</h2>}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )
        })}
      </Suspense>
    </div>
  )
}
