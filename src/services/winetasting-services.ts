import * as z from "zod"
import { prisma } from "@/lib/db"
import { WineDAO } from "./wine-services"
import { TastingDAO } from "./tasting-services"

export type WineTastingDAO = {
	score: number | undefined
	notes: string | undefined
	wineId: string
	wine: WineDAO
	tastingId: string
	tasting: TastingDAO
	createdAt: Date
	updatedAt: Date
}

export const WineTastingSchema = z.object({
	score: z.number().optional(),
	notes: z.string().optional(),
	wineId: z.string().min(1, "wineId is required."),
	tastingId: z.string().min(1, "tastingId is required."),
})

export type WineTastingFormValues = z.infer<typeof WineTastingSchema>




    
export async function createWineTasting(data: WineTastingFormValues) {
  // TODO: implement createWineTasting
  const created = await prisma.wineTasting.create({
    data
  })
  return created
}

