'use client'

import { Album } from '@/prisma/generated/prisma/client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { LuBookCopy } from 'react-icons/lu'

interface AlbumCardProps {
  album: Album
  buyAlbum?: (albumId: number) => Promise<void>
  isInCollection?: boolean
  totalAlbumStickers?: number
}

export default function AlbumCard({
  album,
  buyAlbum,
  isInCollection,
  totalAlbumStickers,
}: AlbumCardProps) {
  const router = useRouter()
  const handleBuyAlbum = async () => {
    try {
      await buyAlbum?.(album.id)
      router.push(`/album/${album.id}`)
    } catch (error) {
      if (error instanceof Error) alert(`Hubo un error: ${error.message}`)
    }
  }

  return (
    <div
      onClick={() => {
        if (isInCollection) router.push(`/album/${album.id}/page/1`)
      }}
      className="w-full flex items-center gap-4 p-4 rounded-lg border border-primary/20"
    >
      {album.coverImgUrl && (
        <Image
          src={album.coverImgUrl}
          alt={album.name}
          width={400}
          height={400}
          className="aspect-[0.8] w-2/5 object-cover border border-gray-400 rounded-md"
        />
      )}
      <div className="flex-1 grid gap-4">
        <h2 className="font-semibold text-xl">{album.name}</h2>
        <p className="">{album.description}</p>
        {totalAlbumStickers && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <LuBookCopy />
            <span className="leading-none">{totalAlbumStickers} figuritas</span>
          </div>
        )}
        {isInCollection ? (
          <Link href={`/album/${album.id}/page/1`} className="block w-full">
            <Button className="w-full">Ver album</Button>
          </Link>
        ) : (
          <Button onClick={handleBuyAlbum} className="w-full">
            Coleccionar
          </Button>
        )}
      </div>
    </div>
  )
}
