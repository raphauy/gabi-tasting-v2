import * as z from "zod"
import { prisma } from "@/lib/db"
import { WineryDAO } from "./winery-services"
import { TastingDAO } from "./tasting-services"

export type WineryTastingDAO = {
	order: number
	wineryId: string
	winery: WineryDAO
	tastingId: string
	tasting: TastingDAO
	createdAt: Date
	updatedAt: Date
}

export const WineryTastingSchema = z.object({
	order: z.number().min(0, "order is required."),
	wineryId: z.string().min(1, "wineryId is required."),
	tastingId: z.string().min(1, "tastingId is required."),
})

export type WineryTastingFormValues = z.infer<typeof WineryTastingSchema>


    
export async function createWineryTasting(data: WineryTastingFormValues) {
  // TODO: implement createWineryTasting
  const created = await prisma.wineryTasting.create({
    data
  })
  return created
}

