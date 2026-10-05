'use client'

import { Album } from '@/prisma/generated/prisma/client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'

interface AlbumCardProps {
  album: Album
  buyAlbum: (albumId: number) => Promise<void>
  isInCollection?: boolean
}

export default function AlbumCard({
  album,
  buyAlbum,
  isInCollection,
}: AlbumCardProps) {
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
    <Card className="relative mx-auto w-full max-w-sm pt-0">
      <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
      {album.coverImgUrl && (
        <Image
          src={album.coverImgUrl}
          alt={album.name}
          width={400}
          height={400}
          className="relative z-20 aspect-video w-full object-cover"
        />
      )}
      <CardHeader>
        <CardAction>
          <Badge variant="secondary">Featured</Badge>
        </CardAction>
        <CardTitle>{album.name}</CardTitle>
        <CardDescription>{album.description}</CardDescription>
      </CardHeader>
      <CardFooter>
        {isInCollection ? (
          <Link href={`/album/${album.id}`} className="block w-full">
            <Button className="w-full">Ver album</Button>
          </Link>
        ) : (
          <Button onClick={handleBuyAlbum} className="w-full">
            Coleccionar
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
