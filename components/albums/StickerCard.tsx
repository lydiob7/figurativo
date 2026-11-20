'use client'

import { Sticker } from '@/prisma/generated/prisma/client'
import { cn } from 'cn'
import Image from 'next/image'
import { Button } from '../ui/button'

interface StickerCardProps {
  copyIsGlued?: boolean
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
  copyIsGlued,
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
          <div className="absolute z-30 inset-0 grid place-items-center opacity-0 group-hover:opacity-100 transition-all">
            {copyIsGlued ? (
              <div className="bg-amber-400 text-gray-800 px-4 py-2 rounded-xs text-sm">
                Esta figurita ya está pegada
              </div>
            ) : (
              <Button
                onClick={() => onGlue && userStickerId && onGlue(userStickerId)}
                disabled={copyIsGlued}
              >
                Pegar figurita
              </Button>
            )}
          </div>
        )}

        <h3 className="absolute z-30 bottom-[11%] inset-x-[12%] text-center font-semibold text-[clamp(0.45rem,5cqw,0.8rem)] leading-none mt-4">
          {sticker.name}
        </h3>
        <span className="absolute z-30 text-white top-[5%] right-[12%] font-semibold font-mono text-[clamp(0.5rem,4cqw,0.8rem)] leading-none">
          {sticker.stickerNumber?.toString().padStart(3, '0')}
        </span>
      </div>
      {!!sticker.description && (
        <p className="tracking-wider text-gray-600 text-sm p-2 border border-gray-300 rounded-md mt-2">
          {sticker.description}
        </p>
      )}
    </div>
  )
}
