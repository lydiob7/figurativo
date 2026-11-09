import OpenPackButton from '@/components/albums/OpenPackButton'
import {
  getRemainingPacksCount,
  openStickerPack,
} from '@/lib/db-functions/sticker-packs'

export default async function AlbumPageLayout({
  children,
  params,
}: LayoutProps<'/album/[id]/page'>) {
  const { id: albumId } = await params
  const remainingPacks = await getRemainingPacksCount()

  return (
    <div className="container mx-auto">
      <div className="flex items-center justify-end">
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
