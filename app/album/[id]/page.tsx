import prismaClient from '@/prisma/lib/prisma'
import { notFound, redirect } from 'next/navigation'

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
  const { id } = await params
  const album = await getAlbum(parseInt(id, 10))
  redirect(`/album/${album.id}/page/1`)
}
