'use client'

import { useRouter } from 'next/navigation'
import { LuArrowLeft, LuArrowRight } from 'react-icons/lu'

type AlbumNavigationArrowProps = {
  direction: 'left' | 'right'
  albumId: number
  albumPageNumbers: number[]
  lastPageNumber?: number
}

export default function AlbumNavigationArrow({
  albumId,
  albumPageNumbers,
  direction = 'left',
  lastPageNumber,
}: AlbumNavigationArrowProps) {
  const router = useRouter()

  function handleNavigateBack() {
    const previousPageNumber =
      Math.min(...albumPageNumbers.map((pageNumber) => pageNumber)) - 1
    if (previousPageNumber < 1) return
    router.push(`/album/${albumId}/page/${previousPageNumber}`)
  }

  function handleNavigateNext() {
    const nextPageNumber =
      Math.max(...albumPageNumbers.map((pageNumber) => pageNumber)) + 1
    if (!lastPageNumber || nextPageNumber > lastPageNumber) return
    router.push(`/album/${albumId}/page/${nextPageNumber}`)
  }

  if (direction === 'right')
    return (
      <button
        className="absolute top-1/2 -right-24 -translate-y-1/2 p-2 border border-gray-800 rounded-full cursor-pointer"
        onClick={handleNavigateNext}
      >
        <LuArrowRight size={48} />
      </button>
    )

  return (
    <button
      className="absolute top-1/2 -left-24 -translate-y-1/2 p-2 border border-gray-800 rounded-full cursor-pointer"
      onClick={handleNavigateBack}
    >
      <LuArrowLeft size={48} />
    </button>
  )
}
