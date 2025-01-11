import * as z from "zod"
import { prisma } from "@/lib/db"
import { WineryDAO } from "./winery-services"
import { WineStyle } from "@prisma/client"

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
})

export type WineFormValues = z.infer<typeof WineSchema>


export async function getWinesDAO() {
  const found = await prisma.wine.findMany({
    orderBy: {
      id: 'asc'
    },
  })
  return found as WineDAO[]
}

export async function getWinesDAOByWineryId(wineryId: string) {
  const found = await prisma.wine.findMany({
    where: {
      wineryId
    },
    orderBy: {
      id: 'asc'
    },
  })
  return found as WineDAO[]
}

export async function getWineDAO(id: string) {
  const found = await prisma.wine.findUnique({
    where: {
      id
    },
  })
  return found as WineDAO
}


    
export async function createWine(data: WineFormValues) {
  const abv = data.abv ? Number(data.abv) : null
  const price = data.price ? Number(data.price) : null
  const created = await prisma.wine.create({
    data: {
      ...data,
      abv,
      price
    }
  })
  return created
}

export async function updateWine(id: string, data: WineFormValues) {
  const abv = data.abv ? Number(data.abv) : null
  const price = data.price ? Number(data.price) : null
  const updated = await prisma.wine.update({
    where: {
      id
    },
    data: {
      ...data,
      abv,
      price
    }
  })
  return updated
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
  const found= await prisma.wine.findMany({
    where: {
      winery: {
        slug: winerySlug
      }
    }
  })
  return found as WineDAO[]
}