import { Sticker } from '@/prisma/generated/prisma/client'
import Image from 'next/image'

export default function StickerCard({ sticker }: { sticker: Sticker }) {
  return (
    <div className="p-4 border border-white rounded-lg">
      {!!sticker.imgUrl && (
        <div className="relative h-40 w-full">
          <Image
            src={sticker.imgUrl}
            alt={sticker.name}
            className="object-contain"
            fill
          />
        </div>
      )}
      <h3 className="text-center font-semibold text-lg mt-4">{sticker.name}</h3>
      {!!sticker.description && (
        <p className="text-center tracking-wider">{sticker.description}</p>
      )}
    </div>
  )
}
