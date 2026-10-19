'use client'

import { useRouter } from 'next/navigation'
import { Button } from '../ui/button'

interface OpenPackButtonProps {
  remainingPacks: number
  albumId: number
  openStickerPack: (albumId: number) => Promise<void>
}

export default function OpenPackButton({
  remainingPacks,
  albumId,
  openStickerPack,
}: OpenPackButtonProps) {
  const router = useRouter()
  return (
    <Button
      disabled={!remainingPacks}
      onClick={() => openStickerPack(albumId).then(() => router.refresh())}
    >
      Abrir paquetes ({remainingPacks})
    </Button>
  )
}
