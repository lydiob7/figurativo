'use client'

import { Album } from '@/prisma/generated/prisma/client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface AlbumCardProps {
  album: Album
  buyAlbum: (albumId: number) => Promise<void>
}

export default function AlbumCard({ album, buyAlbum }: AlbumCardProps) {
  const router = useRouter()
  const handleBuyAlbum = async () => {
    try {
      await buyAlbum(album.id)
      router.push(`/album/${album.id}`)
    } catch (error) {
      if (error instanceof Error) alert(`Hubo un error: ${error.message}`)
    }
  }

  return (
    <div key={album.id} className="border border-white p-8 rounded-xl">
      {!!album.coverImgUrl && (
        <div className="relative h-60 w-full mb-8">
          <Image
            src={album.coverImgUrl}
            alt={album.name}
            className="object-contain"
            fill
          />
        </div>
      )}

      <h2 className="text-2xl font-semibold text-center">{album.name}</h2>

      <button
        type="button"
        onClick={handleBuyAlbum}
        className="block mt-4 text-center mx-auto px-4 py-2 bg-blue-400 text-black"
      >
        Comprar
      </button>
    </div>
  )
}
