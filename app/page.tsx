import AlbumCard from '@/components/albums/AlbumCard'
import prismaClient from '@/prisma/lib/prisma'

async function getAlbums() {
  const albums = await prismaClient.album.findMany({
    where: { status: 'PUBLISHED' },
  })
  return albums
}

async function buyAlbum(albumId: number) {
  'use server'
  await prismaClient.userAlbumCollection.create({
    data: { userId: 1, albumId },
  })
}

export default async function Home() {
  const albums = await getAlbums()
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl text-center uppercase font-bold">Albumes</h1>

      <div className="grid gap-4 grid-cols-4">
        {albums?.map((album) => (
          <AlbumCard key={album.id} album={album} buyAlbum={buyAlbum} />
        ))}
      </div>
    </div>
  )
}
