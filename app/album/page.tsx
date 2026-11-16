import AlbumCard from '@/components/albums/AlbumCard'
import {
  buyAlbum,
  getAlbums,
  getUserAlbumCollections,
} from '@/lib/db-functions/albums'

export default async function AlbumsPage() {
  const albums = await getAlbums()
  const userAlbumIds = (await getUserAlbumCollections()).map((uc) => uc.albumId)
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl text-center uppercase font-bold">Albumes</h1>

      <div className="grid gap-4 grid-cols-4 mt-8">
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
