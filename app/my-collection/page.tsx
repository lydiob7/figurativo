import MyCollection from '@/components/collections/MyCollection'
import { getUserAlbumCollectionsWithMetadata } from '@/lib/db-functions/albums'
import { getAllMyStickers, glueSticker } from '@/lib/db-functions/stickers'

export default async function MyCollectionPage() {
  const myStickers = await getAllMyStickers()
  const myAlbums = await getUserAlbumCollectionsWithMetadata()

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl text-center uppercase font-bold">Mi colección</h1>
      <MyCollection
        glueStickerAction={glueSticker}
        myAlbums={myAlbums}
        myStickers={myStickers}
      />
    </div>
  )
}
