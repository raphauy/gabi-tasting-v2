import * as z from "zod"
import { prisma } from "@/lib/db"
import { getDefaultTastingDays } from "./tastingday-services"
import { WineCriticDAO } from "./winecritic-services"
import { WineDAO } from "./wine-services"

export type WineryDAO = {
	id: string
	name: string
	slug: string
	description: string | null | undefined
	image: string | null | undefined
	wineCriticId: string
	wineCritic: WineCriticDAO
	createdAt: Date
	updatedAt: Date
}

export const WinerySchema = z.object({
	name: z.string().min(1, "name is required."),
	slug: z.string().min(1, "slug is required."),
	description: z.string().nullable().optional(),
	image: z.string().nullable().optional(),
	wineCriticId: z.string().min(1, "wineCriticId is required."),
})

export type WineryFormValues = z.infer<typeof WinerySchema>


export async function getWinerysDAO(wineCriticId: string) {
  const found = await prisma.winery.findMany({
    where: {
      wineCriticId
    },
    orderBy: {
      id: 'asc'
    },
    include: {
      wineCritic: true,
    }
  })
  return found as WineryDAO[]
}

export async function getWineryDAO(id: string) {
  const found = await prisma.winery.findUnique({
    where: {
      id
    },
  })
  return found as WineryDAO
}

export async function getWineryDAOBySlug(slug: string) {
  console.log("getWineryDAOBySlug", slug)
  const found = await prisma.winery.findUnique({
    where: {
      slug
    },
    include: {
      wineCritic: true
    }
  })
  return found as WineryDAO
}
    
export async function createWinery(data: WineryFormValues) {
  const created = await prisma.winery.create({
    data
  })
  
  return created
}

export async function updateWinery(id: string, data: WineryFormValues) {
  const updated = await prisma.winery.update({
    where: {
      id
    },
    data
  })
  return updated
}

export async function deleteWinery(id: string) {
  const deleted = await prisma.winery.delete({
    where: {
      id
    },
  })
  return deleted
}

export async function getWinerysDAOByTastingId(tastingId: string) {
  const found = await prisma.winery.findMany({
    where: {
      tastings: {
        some: {
          tastingId
        }
      }
    }
  })
  return found as WineryDAO[]
}

export async function addWineryToTastingDay(tastingDayId: string, wineryId: string) {
  const created = await prisma.tastingDayWinery.create({
    data: {
      tastingDayId,
      wineryId
    }
  })

  return created
}

export async function getWinerysDAOByWineCriticId(wineCriticId: string) {
  const found = await prisma.winery.findMany({
    where: {
      wineCriticId
    }
  })
  return found as WineryDAO[]
}

export async function addWineryToTasting(tastingId: string, wineryId: string) {
  const created= await prisma.wineryTasting.create({
    data: {
      tastingId,
      wineryId
    }
  })

  // get default tasting day of tasting
  const defaultTastingDay= await prisma.tastingDay.findFirst({
    where: {
      tastingId
    }
  })
  if (defaultTastingDay) {
    await addWineryToTastingDay(defaultTastingDay.id, wineryId)
  } else {
    console.error("No default tasting day found for tasting", tastingId)
  }

  return created
}

export async function removeWineryFromTasting(tastingId: string, wineryId: string) {
  // first remove all tasting days of winery for this tasting
  await prisma.tastingDayWinery.deleteMany({
    where: {
      wineryId,
      tastingDay: {
        tastingId
      }
    }
  })
  const deleted = await prisma.wineryTasting.delete({
    where: {
      wineryId_tastingId: {
        wineryId,
        tastingId
      }
    }
  })
  return deleted
}

export async function addAllWineriesToTasting(tastingId: string, wineryIds: string[]) {
  
  for (const wineryId of wineryIds) {
    await addWineryToTasting(tastingId, wineryId)
  }

  return true
}

export async function removeAllWineriesFromTasting(tastingId: string) {

  const tastingWineries= await getWinerysDAOByTastingId(tastingId)
  for (const tastingWinery of tastingWineries) {
    await removeWineryFromTasting(tastingId, tastingWinery.id)
  }
  
  return true
}

export async function getFirstTastingSlug(wineryId: string) {
  const tasting= await prisma.winery.findFirst({
    where: {
      id: wineryId
    },
    include: {
      tastings: {
        orderBy: {
          order: 'asc'
        },
        include: {
          tasting: true
        }
      }
    }
  })
  if (tasting?.tastings.length === 0) return null

  return tasting?.tastings[0].tasting.slug
}

export async function getWineryNameBySlug(slug: string) {
  const winery= await prisma.winery.findUnique({
    where: {
      slug
    }
  })
  return winery?.name
}
