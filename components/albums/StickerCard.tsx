'use client'

import { Sticker } from '@/prisma/generated/prisma/client'
import Image from 'next/image'

interface StickerCardProps {
  isGlued?: boolean
  isGlueable?: boolean
  onGlue?: (userStickerId: number) => Promise<unknown>
  sticker: Sticker | { id: number; stickerNumber: number }
  userStickerId?: number
}

function isStickerWithName(
  sticker: Sticker | { id: number; stickerNumber: number },
): sticker is Sticker {
  return (sticker as Sticker).name !== undefined
}

export default function StickerCard({
  isGlueable,
  onGlue,
  sticker,
  userStickerId,
}: StickerCardProps) {
  if (!isStickerWithName(sticker))
    return (
      <div className="relative border border-black w-full rounded-md aspect-[0.81] p-8">
        <div className="relative text-center fong-semibold text-3xl font-mono top-1/2 -translate-y-1/2">
          {sticker.stickerNumber?.toString()?.padStart(3, '0')}
        </div>
      </div>
    )

  return (
    <div className="">
      <div className="relative group">
        <div className="absolute w-[calc(100%-32px)] left-4 top-4 aspect-[0.81] bg-[#F3E1CF] z-0" />
        {!!sticker.imgUrl && (
          <div className="absolute w-full aspect-[2] z-10 top-1/2 -translate-y-[calc(50%+24px)]">
            <Image
              src={sticker.imgUrl}
              alt={sticker.name}
              className="object-contain"
              fill
            />
          </div>
        )}
        <Image
          src="/images/sticker-frameworks/distressed.png"
          alt="Distressed framework"
          width={300}
          height={300}
          className="relative z-20 object-contain w-full h-full"
        />

        {isGlueable && (
          <button
            className="absolute z-30 top-1/2 left-1/2 -translate-1/2 bg-green-600 text-white px-8 py-2 rounded-sm font-semibold opacity-0 group-hover:opacity-100 transition-all"
            onClick={() => onGlue && userStickerId && onGlue(userStickerId)}
          >
            Pegar figurita
          </button>
        )}

        <h3 className="absolute z-30 bottom-[10%] left-1/2 -translate-x-1/2 text-center font-semibold text-lg mt-4">
          {sticker.name}
        </h3>
        <span className="absolute z-30 text-white top-[5%] right-[15%] font-semibold font-mono">
          {sticker.stickerNumber?.toString().padStart(3, '0')}
        </span>
      </div>
      {!!sticker.description && (
        <p className="text-center tracking-wider">{sticker.description}</p>
      )}
    </div>
  )
}
