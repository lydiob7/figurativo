'use client'

import { Button } from '../ui/button'

interface OpenPackButtonProps {
  remainingPacks: number
  albumId: number
  openStickerPack: (albumId: number) => void
}

export default function OpenPackButton({
  remainingPacks,
  albumId,
  openStickerPack,
}: OpenPackButtonProps) {
  return (
    <Button disabled={!remainingPacks} onClick={() => openStickerPack(albumId)}>
      Abrir paquetes ({remainingPacks})
    </Button>
  )
}
