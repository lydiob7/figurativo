'use client'

import { Button } from '../ui/button'
import {
  Sticker,
  UserStickerCollection,
} from '@/prisma/generated/prisma/client'
import { useState } from 'react'
import StickerCard from './StickerCard'
import { OpenStickerPackResponse } from '@/lib/db-functions/sticker-packs'
import { LuX } from 'react-icons/lu'
import Link from 'next/link'

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
          className="fixed grid place-items-center z-9999 inset-0 bg-black/60 py-8 px-16"
          onClick={() => handleCloseModal()}
        >
          <button
            className="absolute bg-white rounded-full p-2 top-4 right-8 z-99999 cursor-pointer"
            type="button"
            onClick={() => handleCloseModal()}
          >
            <LuX />
          </button>
          <div className="bg-[#F3E1CF] w-full h-auto rounded-md px-8 py-16 overflow-auto max-w-6xl mx-auto flex flex-col items-center gap-8">
            <div className="grid gap-4 grid-cols-5">
              {newStickers?.map((stickerUserCollection) => (
                <StickerCard
                  key={stickerUserCollection.id}
                  sticker={stickerUserCollection.sticker}
                />
              ))}
            </div>

            <Link href="/my-collection">
              <Button>Mi colección</Button>
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
