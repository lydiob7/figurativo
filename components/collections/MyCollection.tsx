'use client'

import { UserStickerCollectionWithCopyIsGlued } from '@/lib/db-functions/stickers'
import StickerCard from '../albums/StickerCard'
import { useState } from 'react'
import AlbumCard from '../albums/AlbumCard'
import { Album, UserAlbumCollection } from '@/prisma/generated/prisma/client'
import { Button } from '../ui/button'

type MyCollectionProps = {
  glueStickerAction: (userStickerId: number) => Promise<unknown>
  myAlbums: (UserAlbumCollection & { album: Album })[]
  myStickers: UserStickerCollectionWithCopyIsGlued[]
}

export default function MyCollection({
  glueStickerAction,
  myAlbums,
  myStickers,
}: MyCollectionProps) {
  const [currentTab, setCurrentTab] = useState<'stickers' | 'albums'>(
    'stickers',
  )

  return (
    <div>
      <div className="flex items-center">
        <Button
          type="button"
          onClick={() => setCurrentTab('stickers')}
          variant={currentTab === 'stickers' ? 'default' : 'ghost'}
        >
          Stickers
        </Button>

        <Button
          type="button"
          onClick={() => setCurrentTab('albums')}
          variant={currentTab === 'albums' ? 'default' : 'ghost'}
        >
          Albums
        </Button>
      </div>

      {currentTab === 'stickers' && (
        <div className="grid grid-cols-6 gap-4 mt-8">
          {myStickers.map((userSticker) => (
            <StickerCard
              key={userSticker.id}
              copyIsGlued={userSticker.copyIsGlued}
              isGlueable
              onGlue={glueStickerAction}
              sticker={userSticker.sticker}
              userStickerId={userSticker.id}
            />
          ))}
        </div>
      )}

      {currentTab === 'albums' && (
        <div className="grid gap-4 grid-cols-3 mt-8">
          {myAlbums?.map((userAlbum) => (
            <AlbumCard
              key={`${userAlbum.userId}-${userAlbum.albumId}`}
              album={userAlbum.album}
              isInCollection
            />
          ))}
        </div>
      )}
    </div>
  )
}
