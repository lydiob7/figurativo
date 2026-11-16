import { Album, UserAlbumCollection } from '@/prisma/generated/prisma/client'
import prismaClient from '@/prisma/lib/prisma'
import { getUser } from '@/utils/getUser'
import { notFound } from 'next/navigation'

export async function getAlbums() {
  const albums = await prismaClient.album.findMany({
    where: { status: 'PUBLISHED' },
  })
  return albums
}

export async function buyAlbum(albumId: number) {
  'use server'
  // TODO: esta funcion va a necesitar la sesion del usuario desde las cookies
  const user = await getUser()
  await prismaClient.userAlbumCollection.create({
    data: { userId: user.id, albumId },
  })
}

export async function getUserAlbumCollections(): Promise<
  UserAlbumCollection[]
> {
  const user = await getUser()
  const userCollections = await prismaClient.userAlbumCollection.findMany({
    where: { userId: user.id },
  })
  return userCollections
}

export async function getUserAlbumCollectionsWithMetadata(): Promise<
  (UserAlbumCollection & { album: Album })[]
> {
  const user = await getUser()
  const userCollections = await prismaClient.userAlbumCollection.findMany({
    where: { userId: user.id },
    include: {
      album: true,
    },
  })
  return userCollections
}

export async function getAlbum(id: number) {
  const album = await prismaClient.album.findUnique({
    where: { id, status: 'PUBLISHED' },
    include: {
      pages: true,
    },
  })
  if (!album) notFound()
  return album
}

export async function getAlbumPages(albumId: number, pageNumbers: number[]) {
  const albumPages = await prismaClient.albumPage.findMany({
    where: {
      pageNumber: { in: pageNumbers },
      albumId,
      album: { status: 'PUBLISHED' },
    },
    include: {
      template: true,
      stickers: {
        select: {
          id: true,
          stickerNumber: true,
        },
        orderBy: {
          stickerNumber: 'asc',
        },
      },
    },
  })
  if (!albumPages || albumPages.length < 1) notFound()
  return albumPages
}

export async function getAlbumLastPageNumber(albumId: number) {
  const lastPage = await prismaClient.albumPage.findFirst({
    where: {
      albumId,
      album: { status: 'PUBLISHED' },
    },
    orderBy: {
      pageNumber: 'desc',
    },
  })
  return lastPage?.pageNumber || 0
}
