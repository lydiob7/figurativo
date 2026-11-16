import { getAlbum } from '@/lib/db-functions/albums'
import { redirect } from 'next/navigation'

export default async function Album({ params }: PageProps<'/album/[id]'>) {
  const { id } = await params
  const album = await getAlbum(parseInt(id, 10))
  redirect(`/album/${album.id}/page/1`)
}
