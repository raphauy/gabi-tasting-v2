import * as z from "zod"
import { prisma } from "@/lib/db"
import { WineryDAO } from "./winery-services"
import { WineStyle } from "@prisma/client"
import { TastingDAO } from "./tasting-services"

export type WineDAO = {
	id: string
	name: string
	vintage: string
	region: string
	style: WineStyle
	abv: number | undefined
	price: number | undefined
	wineryId: string
	winery: WineryDAO
	tastings: TastingDAO[]
	createdAt: Date
	updatedAt: Date
}

export const WineSchema = z.object({
	name: z.string().min(1, "name is required."),
	vintage: z.string().min(1, "vintage is required."),
	region: z.string().min(1, "region is required."),
	style: z.nativeEnum(WineStyle),
	abv: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
	price: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
	wineryId: z.string().min(1, "wineryId is required."),
	tastingId: z.string(),
})

export type WineFormValues = z.infer<typeof WineSchema>


export async function getWinesDAOByWineCriticSlug(wineCriticSlug: string) {
  const found = await prisma.wine.findMany({
    where: {
      winery: {
        wineCritic: {
          slug: wineCriticSlug
        }
      }
    },
    include: {
      winery: true
    },
    orderBy: {
      id: 'asc'
    },
  })
  return found as WineDAO[]
}

export async function getWinesDAOByWineryAndTasting(wineryId: string, tastingId: string) {
  const found = await prisma.wine.findMany({
    where: {
      wineryId,
      tastings: {
        some: {
          tastingId
        }
      }
    },
    orderBy: {
      id: 'asc'
    },
    include: {
      tastings: {
        include: {
          tasting: true
        }
      },
      winery: {
        include: {
          wineCritic: true
        }
      }
    }
  })
  return found.map(wine => ({
    ...wine,
    tastings: wine.tastings.map(wt => wt.tasting)
  })) as WineDAO[]
}

export async function getWinesDAOByWineryId(wineryId: string) {
  const found = await prisma.wine.findMany({
    where: {
      wineryId
    },
    include: {
      winery: true,
      tastings: {
        include: {
          tasting: true
        }
      }
    },
    orderBy: {
      id: 'asc'
    },
  })
  return found.map(wine => ({
    ...wine,
    tastings: wine.tastings.map(wt => wt.tasting)
  })) as WineDAO[]
}

export async function getWinesDAOByTastingId(tastingId: string) {
  const found = await prisma.wine.findMany({
    where: {
      tastings: {
        some: {
          tastingId
        }
      }
    }
  })
  return found as WineDAO[]
}

export async function getWineDAO(id: string) {
  const found = await prisma.wine.findUnique({
    where: {
      id
    },
    include: {
      tastings: {
        include: {
          tasting: true
        }
      },
      winery: {
        include: {
          wineCritic: true
        }
      }
    }
  })
  if (!found) return null
  return {
    ...found,
    tastings: found.tastings.map(wt => wt.tasting)
  } as WineDAO
}


    
export async function createWine(data: WineFormValues) {
  console.log(data)
  const abv = data.abv ? Number(data.abv) : null
  const price = data.price ? Number(data.price) : null
  const { tastingId, ...wineData } = data

  const created = await prisma.wine.create({
    data: {
      ...wineData,
      abv,
      price,
      tastings: {
        create: {
          tastingId
        }
      }
    },
    include: {
      tastings: {
        include: {
          tasting: true
        }
      },
      winery: {
        include: {
          wineCritic: true
        }
      }
    }
  })

  return {
    ...created,
    tastings: created.tastings.map(wt => wt.tasting)
  } as WineDAO
}

export async function updateWine(id: string, data: WineFormValues) {
  const abv = data.abv ? Number(data.abv) : null
  const price = data.price ? Number(data.price) : null
  const { tastingId, ...wineData } = data
  const updated = await prisma.wine.update({
    where: {
      id
    },
    data: {
      ...wineData,
      abv,
      price
    },
    include: {
      tastings: {
        include: {
          tasting: true
        }
      },
      winery: {
        include: {
          wineCritic: true
        }
      }
    }
  })
  return {
    ...updated,
    tastings: updated.tastings.map(wt => wt.tasting)
  } as WineDAO
}

export async function deleteWine(id: string) {
  const deleted = await prisma.wine.delete({
    where: {
      id
    },
  })
  return deleted
}

export async function getWinesDAOByWinerySlug(winerySlug: string) {
  const found = await prisma.wine.findMany({
    where: {
      winery: {
        slug: winerySlug
      }
    },
    include: {
      tastings: {
        include: {
          tasting: true
        }
      },
      winery: {
        include: {
          wineCritic: true
        }
      }
    }
  })
  return found.map(wine => ({
    ...wine,
    tastings: wine.tastings.map(wt => wt.tasting)
  })) as WineDAO[]
}