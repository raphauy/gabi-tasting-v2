import { prisma } from "@/lib/db"
import * as z from "zod"
import { TastingDAO } from "./tasting-services"
import { TastingDayWineryDAO } from "./tastingdaywinery-services"

export type KanbanTastingDayDAO = {
	id: string
	date: Date | null | undefined
	isDefault: boolean
  order: number
	tastingId: string
	tasting: TastingDAO
}
export type KanbanTastingDayDAOWithWineries = KanbanTastingDayDAO & {
  wineries: TastingDayWineryDAO[]
}

export type TastingDayDAO = {
	id: string
	date: Date | null | undefined
	isDefault: boolean
  order: number
	tastingId: string
	tasting: TastingDAO
	createdAt: Date
	updatedAt: Date
}

export const TastingDaySchema = z.object({
	date: z.date().nullable().optional(),
	tastingId: z.string().min(1, "tastingId is required."),
	isDefault: z.boolean().optional(),
})

export type TastingDayFormValues = z.infer<typeof TastingDaySchema>


export async function getTastingDaysDAO(tastingId: string) {
  const found = await prisma.tastingDay.findMany({
    where: {
      tastingId
    },
    orderBy: {
      id: 'asc'
    },
  })
  return found as TastingDayDAO[]
}

export async function getTastingDayDAO(id: string) {
  const found = await prisma.tastingDay.findUnique({
    where: {
      id
    },
  })
  return found as TastingDayDAO
}


    
export async function createTastingDay(data: TastingDayFormValues) {
  // TODO: implement createTastingDay
  const created = await prisma.tastingDay.create({
    data
  })
  return created
}

export async function updateTastingDay(id: string, data: TastingDayFormValues) {
  const updated = await prisma.tastingDay.update({
    where: {
      id
    },
    data
  })
  return updated
}

export async function deleteTastingDay(id: string) {
  const deleted = await prisma.tastingDay.delete({
    where: {
      id
    },
  })
  return deleted
}

export async function updateKanbanTastingDays(tastingId: string, tastingDays: KanbanTastingDayDAO[]) {
  console.log("updateKanban", tastingDays)
  try {
    const transaction= tastingDays.map((tastingDay) => 
      prisma.tastingDay.update({
        where: { 
          id: tastingDay.id,
          tastingId
        },
        data: {
          order: tastingDay.order
        }
      })
    )
    const updated = await prisma.$transaction(transaction)
    return updated
  } catch (error) {
    console.error(error)
    throw "Error al reordenar los estados"
  }
}

export async function getKanbanTastingDays(tastingId: string) {
  const tastingDays= await prisma.tastingDay.findMany({
    where: {
      tastingId
    },
    orderBy: {
      order: 'asc'
    },
    include: {
      wineries: {
        include: {
          winery: true,
          tastingDay: true
        },
        orderBy: {
          order: 'asc'
        }
      }
    }
  })
  return tastingDays as unknown as KanbanTastingDayDAOWithWineries[]
}

export async function getDefaultTastingDays() {
  const tastingDays = await prisma.tastingDay.findMany({
    where: {
      isDefault: true
    }
  })
  return tastingDays as TastingDayDAO[]
}