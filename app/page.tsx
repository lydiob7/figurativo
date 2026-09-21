import prismaClient from '@/prisma/lib/prisma'

async function getAlbums() {
  const albums = await prismaClient.album.findMany()
  return albums
}

export default async function Home() {
  const albums = await getAlbums()
  console.log(albums)
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl text-center uppercase font-bold">Figurativo</h1>

      <div className="grid gap-4 grid-cols-4">
        <div className="border border-white p-8 rounded-xl">
          <h2 className="text-2xl font-semibold text-center">
            Nombre del album
          </h2>
        </div>
      </div>
    </div>
  )
}
