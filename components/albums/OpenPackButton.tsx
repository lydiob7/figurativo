'use client'

import { Button } from '../ui/button'
import {
  Sticker,
  UserStickerCollection,
} from '@/prisma/generated/prisma/client'
import { useState } from 'react'
import StickerCard from './StickerCard'
import { OpenStickerPackResponse } from '@/lib/db-functions/sticker-packs'

interface OpenPackButtonProps {
  remainingPacks: number
  albumId: number
  openStickerPack: (albumId: number) => Promise<OpenStickerPackResponse>
}

export default function OpenPackButton({
  remainingPacks: _remainingPacks,
  albumId,
  openStickerPack,
}: OpenPackButtonProps) {
  const [remainingPacks, setRemainingPacks] = useState(_remainingPacks)
  const [isPackModalOpen, setIsPackModalOpen] = useState(false)
  const [newStickers, setNewStickers] = useState<
    (UserStickerCollection & { sticker: Sticker })[] | null
  >(null)

  const handleCloseModal = () => {
    setIsPackModalOpen(false)
  }

  return (
    <>
      <Button
        disabled={!remainingPacks}
        onClick={() =>
          openStickerPack(albumId).then((response) => {
            setIsPackModalOpen(true)
            setNewStickers(response.stickerCollected)
            setRemainingPacks(response.remainingPacksCount)
          })
        }
      >
        Abrir paquetes ({remainingPacks})
      </Button>

      {isPackModalOpen && (
        <div
          className="fixed z-20 inset-0 bg-black/60 py-8 px-16"
          onClick={() => handleCloseModal()}
        >
          <button
            className="absolute top-4 right-8"
            type="button"
            onClick={() => handleCloseModal()}
          >
            X
          </button>
          <div className="bg-slate-800 w-full h-full rounded-xl p-8 overflow-auto max-w-6xl mx-auto">
            <div className="grid gap-4 grid-cols-4">
              {newStickers?.map((stickerUserCollection) => (
                <StickerCard
                  key={stickerUserCollection.id}
                  sticker={stickerUserCollection.sticker}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
