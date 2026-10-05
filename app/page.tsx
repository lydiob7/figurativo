import AlbumCard from '@/components/albums/AlbumCard'
import prismaClient from '@/prisma/lib/prisma'
import { getUser } from '@/utils/getUser'

async function getAlbums() {
  const albums = await prismaClient.album.findMany({
    where: { status: 'PUBLISHED' },
  })
  return albums
}

async function buyAlbum(albumId: number) {
  'use server'
  // TODO: esta funcion va a necesitar la sesion del usuario desde las cookies
  const user = await getUser()
  await prismaClient.userAlbumCollection.create({
    data: { userId: user.id, albumId },
  })
}

async function getUserCollections() {
  const user = await getUser()
  const userCollections = await prismaClient.userAlbumCollection.findMany({
    where: { userId: user.id },
  })
  return userCollections
}

export default async function Home() {
  const albums = await getAlbums()
  const userAlbumIds = (await getUserCollections()).map((uc) => uc.albumId)
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl text-center uppercase font-bold">Albumes</h1>

      <div className="grid gap-4 grid-cols-4">
        {albums?.map((album) => (
          <AlbumCard
            key={album.id}
            album={album}
            buyAlbum={buyAlbum}
            isInCollection={userAlbumIds.includes(album.id)}
          />
        ))}
      </div>
    </div>
  )
}
