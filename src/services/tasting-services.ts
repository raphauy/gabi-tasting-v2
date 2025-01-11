import * as z from "zod"
import { prisma } from "@/lib/db"
import { WineCriticDAO } from "./winecritic-services"
import { createTastingDay } from "./tastingday-services"
import { getWineryDAOBySlug } from "./winery-services"

export type TastingDAO = {
	id: string
	name: string
	slug: string
	description: string | null | undefined
	wineCriticId: string
	wineCritic: WineCriticDAO
	createdAt: Date
	updatedAt: Date
}

export const TastingSchema = z.object({
	name: z.string().min(1, "name is required."),
	slug: z.string().min(1, "slug is required."),
	description: z.string().nullable().optional(),
	wineCriticId: z.string().min(1, "wineCriticId is required."),
})

export type TastingFormValues = z.infer<typeof TastingSchema>


export async function getTastingsDAO(wineCriticId: string) {
  const found = await prisma.tasting.findMany({
    where: {
      wineCriticId
    },
    orderBy: {
      id: 'asc'
    },
    include: {
      wineCritic: {
        select: {
          slug: true
        }
      }
    }
  })
  return found as TastingDAO[]
}

export async function getTastingDAO(id: string) {
  const found = await prisma.tasting.findUnique({
    where: {
      id
    },
  })
  return found as TastingDAO
}


export async function getTastingDAOBySlug(slug: string) {
  const found = await prisma.tasting.findUnique({
    where: {
      slug
    },
    include: {
      wineCritic: {
        select: {
          slug: true
        }
      }
    }
  })
  return found as TastingDAO
}

    
export async function createTasting(data: TastingFormValues) {
  const created = await prisma.tasting.create({
    data
  })
  // create default tasting day
  await createTastingDay({
    tastingId: created.id,
    isDefault: true
  })
  return created
}

export async function updateTasting(id: string, data: TastingFormValues) {
  const updated = await prisma.tasting.update({
    where: {
      id
    },
    data
  })
  return updated
}

export async function deleteTasting(id: string) {
  const deleted = await prisma.tasting.delete({
    where: {
      id
    },
  })
  return deleted
}

export async function getTastingsDAOByWinerySlug(winerySlug: string) {
  const winery = await getWineryDAOBySlug(winerySlug)
  if (!winery) {
    throw new Error("Winery not found")
  }
  const found = await prisma.wineryTasting.findMany({
    where: {
      wineryId: winery.id      
    },
    include: {
      tasting: true
    }
  })
  const res= found.map(item => item.tasting) as TastingDAO[]
  console.log(`Found ${res.length} tastings for winery ${winerySlug}`)
  return res
} 