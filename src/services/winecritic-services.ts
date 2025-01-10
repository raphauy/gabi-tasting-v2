import * as z from "zod"
import { prisma } from "@/lib/db"

export type WineCriticDAO = {
	id: string
	name: string
	slug: string
	description: string | null | undefined
	createdAt: Date
	updatedAt: Date
}

export const WineCriticSchema = z.object({
	name: z.string().min(1, "name is required."),
	slug: z.string().min(1, "slug is required."),
	description: z.string().nullable().optional(),
})

export type WineCriticFormValues = z.infer<typeof WineCriticSchema>


export async function getWineCriticsDAO() {
  const found = await prisma.wineCritic.findMany({
    orderBy: {
      id: 'asc'
    },
  })
  return found as WineCriticDAO[]
}

export async function getWineCriticDAO(id: string) {
  const found = await prisma.wineCritic.findUnique({
    where: {
      id
    },
  })
  return found as WineCriticDAO
}
    
export async function createWineCritic(data: WineCriticFormValues) {
  // TODO: implement createWineCritic
  const created = await prisma.wineCritic.create({
    data
  })
  return created
}

export async function updateWineCritic(id: string, data: WineCriticFormValues) {
  const updated = await prisma.wineCritic.update({
    where: {
      id
    },
    data
  })
  return updated
}

export async function deleteWineCritic(id: string) {
  const deleted = await prisma.wineCritic.delete({
    where: {
      id
    },
  })
  return deleted
}

export async function getWineCriticsDAOBySlug(slug: string) {
  const found = await prisma.wineCritic.findUnique({
    where: {
      slug
    },
  })
  return found as WineCriticDAO
}