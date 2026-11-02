import { Sticker } from '@/prisma/generated/prisma/client'
import Image from 'next/image'

export default function StickerCard({ sticker }: { sticker: Sticker }) {
  return (
    <div className="">
      <div className="relative">
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
        <h3 className="absolute z-30 bottom-12 left-1/2 -translate-x-1/2 text-center font-semibold text-lg mt-4">
          {sticker.name}
        </h3>
        <span className="absolute z-30 text-white top-6.5 right-14 font-semibold font-mono">
          {sticker.stickerNumber?.toString().padStart(3, '0')}
        </span>
      </div>
      {!!sticker.description && (
        <p className="text-center tracking-wider">{sticker.description}</p>
      )}
    </div>
  )
}
