'use client'

import { UserStickerCollectionWithCopyIsGlued } from '@/lib/db-functions/stickers'
import StickerCard from '../albums/StickerCard'
import { useState } from 'react'
import AlbumCard from '../albums/AlbumCard'
import { Album, UserAlbumCollection } from '@/prisma/generated/prisma/client'

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
        <button
          type="button"
          onClick={() => setCurrentTab('stickers')}
          className={`px-4 py-2 font-semibold ${currentTab === 'stickers' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Stickers
        </button>

        <button
          type="button"
          onClick={() => setCurrentTab('albums')}
          className={`px-4 py-2 font-semibold ${currentTab === 'albums' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Albums
        </button>
      </div>

      {currentTab === 'stickers' && (
        <div className="grid grid-cols-4 gap-4 mt-8">
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
