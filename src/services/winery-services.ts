import * as z from "zod"
import { prisma } from "@/lib/db"
import { getDefaultTastingDays } from "./tastingday-services"

export type WineryDAO = {
	id: string
	name: string
	slug: string
	description: string | null | undefined
	image: string | null | undefined
	createdAt: Date
	updatedAt: Date
}

export const WinerySchema = z.object({
	name: z.string().min(1, "name is required."),
	slug: z.string().min(1, "slug is required."),
	description: z.string().nullable().optional(),
	image: z.string().nullable().optional(),
})

export type WineryFormValues = z.infer<typeof WinerySchema>


export async function getWinerysDAO() {
  const found = await prisma.winery.findMany({
    orderBy: {
      id: 'asc'
    },
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
    
export async function createWinery(data: WineryFormValues) {
  // TODO: implement createWinery
  const created = await prisma.winery.create({
    data
  })
  
  const defaultTastingDays = await getDefaultTastingDays()
  for (const tastingDay of defaultTastingDays) {
    await addWineryToTastingDay(tastingDay.id, created.id)
  }
  
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