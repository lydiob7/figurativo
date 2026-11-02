import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient, Rarity, Status } from './generated/prisma/client'

type PokeApiPokemon = {
  name: string
  types: Array<{
    slot: number
    type: { name: string }
  }>
  sprites: {
    other?: {
      'official-artwork'?: {
        front_default: string | null
      }
    }
  }
}

type PokemonSeed = {
  id: number
  name: string
  imgUrl: string
  description: string
  rarity: Rarity
}

const legendary = new Set([150, 151])
const epic = new Set([3, 6, 9, 65, 94, 131, 133, 143, 144, 149])
const rare = new Set([1, 4, 7, 25, 26, 31, 34, 38, 59, 68, 76, 78, 112, 121, 130, 134, 135, 136, 142, 148])

const displayNameOverrides = new Map([
  ['farfetchd', "Farfetch'd"],
  ['mr-mime', 'Mr. Mime'],
  ['nidoran-f', 'Nidoran♀'],
  ['nidoran-m', 'Nidoran♂'],
])

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})
const prisma = new PrismaClient({ adapter })

function formatName(name: string) {
  return displayNameOverrides.get(name)
    ?? name.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')
}

function formatType(name: string) {
  return name.charAt(0).toUpperCase() + name.slice(1)
}

function getRarity(id: number): Rarity {
  if (legendary.has(id)) return Rarity.LEGENDARY
  if (epic.has(id)) return Rarity.EPIC
  if (rare.has(id)) return Rarity.RARE
  return Rarity.COMMON
}

async function fetchPokemon(id: number): Promise<PokemonSeed> {
  let lastError: unknown

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
      if (!response.ok) throw new Error(`PokeAPI returned HTTP ${response.status}`)

      const pokemon = await response.json() as PokeApiPokemon
      const name = formatName(pokemon.name)
      const types = pokemon.types
        .sort((a, b) => a.slot - b.slot)
        .map(({ type }) => formatType(type.name))
      const typeDescription = types.length === 1
        ? `${types[0]}-type`
        : `${types.join(' and ')}-type`
      const imgUrl = pokemon.sprites.other?.['official-artwork']?.front_default

      if (!imgUrl) throw new Error(`No official artwork returned for Pokémon ${id}`)

      return {
        id,
        name,
        imgUrl,
        description: `${name} is a ${typeDescription} Pokémon, number ${String(id).padStart(3, '0')} in the original Kanto Pokédex.`,
        rarity: getRarity(id),
      }
    } catch (error) {
      lastError = error
      if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, attempt * 300))
    }
  }

  const message = lastError instanceof Error ? lastError.message : String(lastError)
  throw new Error(`Failed to fetch Pokémon ${id}: ${message}`)
}

async function mapWithConcurrency<T, U>(
  values: T[],
  concurrency: number,
  mapper: (value: T) => Promise<U>,
) {
  const results = new Array<U>(values.length)
  let cursor = 0

  const workers = Array.from({ length: concurrency }, async () => {
    while (cursor < values.length) {
      const index = cursor
      cursor += 1
      results[index] = await mapper(values[index])
    }
  })

  await Promise.all(workers)
  return results
}

async function main() {
  const pokemon = await mapWithConcurrency(
    Array.from({ length: 151 }, (_, index) => index + 1),
    12,
    fetchPokemon,
  )

  const albumId = await prisma.$transaction(async (tx) => {
    const author = await tx.user.findFirst({ orderBy: { id: 'asc' } })
    if (!author) throw new Error('Cannot seed the album because no user exists to own it')

    const template = await tx.albumPageTemplate.findFirst({
      where: { stickerQty: 5 },
      orderBy: { id: 'asc' },
    })
    if (!template) {
      throw new Error('Cannot seed the album because no five-sticker page template exists')
    }

    const albumData = {
      status: Status.PUBLISHED,
      coverImgUrl: pokemon[24].imgUrl,
      backCoverImgUrl: pokemon[150].imgUrl,
      description: 'The complete first-generation Pokédex: collect all 151 Pokémon from Kanto.',
      stickersPerPack: 5,
    }
    const existingAlbum = await tx.album.findFirst({
      where: { name: 'Pokemon' },
      orderBy: { id: 'asc' },
    })
    const album = existingAlbum
      ? await tx.album.update({ where: { id: existingAlbum.id }, data: albumData })
      : await tx.album.create({
          data: {
            name: 'Pokemon',
            ...albumData,
            author: { connect: { id: author.id } },
          },
        })

    const pageIds = new Map<number, number>()

    for (let pageNumber = 1; pageNumber <= 31; pageNumber += 1) {
      const first = (pageNumber - 1) * 5 + 1
      const last = Math.min(pageNumber * 5, 151)
      const page = await tx.albumPage.upsert({
        where: {
          albumId_pageNumber: {
            albumId: album.id,
            pageNumber,
          },
        },
        update: {
          name: `Pokémon ${String(first).padStart(3, '0')}–${String(last).padStart(3, '0')}`,
          template: { connect: { id: template.id } },
        },
        create: {
          album: { connect: { id: album.id } },
          pageNumber,
          name: `Pokémon ${String(first).padStart(3, '0')}–${String(last).padStart(3, '0')}`,
          template: { connect: { id: template.id } },
        },
      })
      pageIds.set(pageNumber, page.id)
    }

    const existingStickers = await tx.sticker.findMany({
      where: { albumPage: { albumId: album.id } },
      orderBy: { id: 'asc' },
    })
    const existingByNumber = new Map<number, number>()

    for (const sticker of existingStickers) {
      if (
        sticker.stickerNumber < 1
        || sticker.stickerNumber > 151
        || existingByNumber.has(sticker.stickerNumber)
      ) {
        throw new Error(
          `Album contains an unsupported or duplicate sticker number: ${sticker.stickerNumber}`,
        )
      }
      existingByNumber.set(sticker.stickerNumber, sticker.id)
    }

    for (const item of pokemon) {
      const pageId = pageIds.get(Math.ceil(item.id / 5))!
      const stickerData = {
        name: item.name,
        stickerNumber: item.id,
        status: Status.PUBLISHED,
        imgUrl: item.imgUrl,
        description: item.description,
        rarity: item.rarity,
        albumPage: { connect: { id: pageId } },
      }
      const existingId = existingByNumber.get(item.id)

      if (existingId) {
        await tx.sticker.update({
          where: { id: existingId },
          data: stickerData,
        })
      } else {
        await tx.sticker.create({ data: stickerData })
      }
    }

    return album.id
  }, { timeout: 60_000 })

  const [stickerCount, rarityCounts] = await Promise.all([
    prisma.sticker.count({ where: { albumPage: { albumId } } }),
    prisma.sticker.groupBy({
      by: ['rarity'],
      where: { albumPage: { albumId } },
      _count: true,
    }),
  ])

  console.log(`Seeded Pokemon album ${albumId} with ${stickerCount} stickers.`)
  console.table(rarityCounts.map(({ rarity, _count }) => ({ rarity, count: _count })))
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
