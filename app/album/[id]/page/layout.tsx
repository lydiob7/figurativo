import OpenPackButton from '@/components/albums/OpenPackButton'
import {
  getRemainingPacksCount,
  openStickerPack,
} from '@/lib/db-functions/sticker-packs'
import Link from 'next/link'

export default async function AlbumPageLayout({
  children,
  params,
}: LayoutProps<'/album/[id]/page'>) {
  const { id: albumId } = await params
  const remainingPacks = await getRemainingPacksCount()

  return (
    <div className="container mx-auto">
      <div className="flex items-center justify-between">
        <Link href={`/album/${albumId}`}>&lt; Volver al album</Link>

        <OpenPackButton
          albumId={parseInt(albumId, 10)}
          remainingPacks={remainingPacks}
          openStickerPack={openStickerPack}
        />
      </div>
      <div>{children}</div>
    </div>
  )
}
