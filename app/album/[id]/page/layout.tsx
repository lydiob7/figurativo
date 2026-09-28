import Link from 'next/link'

export default async function AlbumPageLayout({
  children,
  params,
}: LayoutProps<'/album/[id]/page'>) {
  const { id: albumId } = await params
  return (
    <div className="container mx-auto">
      <Link href={`/album/${albumId}`}>&lt; Volver al album</Link>
      <div>{children}</div>
    </div>
  )
}
