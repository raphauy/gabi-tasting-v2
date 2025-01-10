import * as z from "zod"
import { prisma } from "@/lib/db"
import { TastingDayDAO } from "./tastingday-services"
import { WineryDAO } from "./winery-services"
import { WineryTastingDAO } from "./winerytasting-services"

export type TastingDayWineryDAO = {
	order: number
	tastingDayId: string
	tastingDay: TastingDayDAO
	wineryId: string
	winery: WineryDAO
	createdAt: Date
	updatedAt: Date
}

export const TastingDayWinerySchema = z.object({
	order: z.number().min(0, "order is required."),
	tastingDayId: z.string().min(1, "tastingDayId is required."),
	wineryId: z.string().min(1, "wineryId is required."),
})

export type TastingDayWineryFormValues = z.infer<typeof TastingDayWinerySchema>


    
export async function createTastingDayWinery(data: TastingDayWineryFormValues) {
  // TODO: implement createTastingDayWinery
  const created = await prisma.tastingDayWinery.create({
    data
  })
  return created
}

export async function updateKanbanTastingDaysWineries(wineries: TastingDayWineryDAO[]) {
	try {
		// Verificar que todos los TastingDays existan
		for (const winery of wineries) {
			const tastingDay = await prisma.tastingDay.findFirst({
				where: {
					id: winery.tastingDayId,
				}
			})
			
			if (!tastingDay) {
				throw new Error(`El tastingDay ${winery.tastingDayId} no existe`)
			}
		}

		const transaction = wineries.map((winery) => 
			// Primero eliminamos la relación anterior
			prisma.tastingDayWinery.deleteMany({
				where: {
					wineryId: winery.wineryId,
					tastingDayId: winery.tastingDay.id
				}
			})
			.then(() => 
				// Luego creamos la nueva relación
				prisma.tastingDayWinery.create({
					data: {
						order: winery.order,
						wineryId: winery.wineryId,
						tastingDayId: winery.tastingDayId
					}
				})
			)
		)

		const updated = await Promise.all(transaction)
		return updated
	} catch (error) {
		console.error(error)
		throw "Error al mover las wineries entre tasting days"
	}
}
  