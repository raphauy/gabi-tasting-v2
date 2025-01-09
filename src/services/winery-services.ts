import * as z from "zod"
import { prisma } from "@/lib/db"

export type WineryDAO = {
	id: string
	name: string
	slug: string
	description: string
	createdAt: Date
	updatedAt: Date
}

export const WinerySchema = z.object({
	name: z.string().min(1, "name is required."),
	slug: z.string().min(1, "slug is required."),
	description: z.string().min(1, "description is required."),
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

