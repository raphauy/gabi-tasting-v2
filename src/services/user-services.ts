import { prisma } from "@/lib/db"
import { Role } from "@prisma/client"
import * as z from "zod"
import { WineCriticDAO } from "./winecritic-services"
import { WineryDAO } from "./winery-services"

export type UserDAO = {
	id: string
	name: string | null
	email: string
	emailVerified: Date | null
	image: string | null | undefined
	role: Role
	wineCriticId: string | null
	wineCritic: WineCriticDAO | null
	wineryId: string | null
	winery: WineryDAO | null
	createdAt: Date
	updatedAt: Date
}

export const userSchema = z.object({
	name: z.string().nullable().optional(),
	email: z.string().email(),
	role: z.nativeEnum(Role),
	image: z.string().nullable().optional(),	
	wineCriticId: z.string().nullable().optional(),
	wineryId: z.string().nullable().optional(),
})

export type UserFormValues = z.infer<typeof userSchema>


export async function getUsersDAO() {
  const found = await prisma.user.findMany({
    orderBy: {
      id: 'asc'
    },
  })
  return found as UserDAO[]
}

export async function getUserDAO(id: string) {
  const found = await prisma.user.findUnique({
    where: {
      id
    },
  })
  return found as UserDAO
}
    
export async function createUser(data: UserFormValues) {

  const created = await prisma.user.create({
    data,
    include: {
      wineCritic: true,
      winery: {
        include: {
          tastings: {
            include: {
              tasting: true
            },
            orderBy: {
              createdAt: 'desc'
            },
            take: 1
          }
        }
      }
    }
  })

  return created
}

export async function updateUser(id: string, data: UserFormValues) {
  const updated = await prisma.user.update({
    where: {
      id
    },
    data
  })

  return updated
}

export async function deleteUser(id: string) {
  const deleted = await prisma.user.delete({
    where: {
      id
    },
  })
  return deleted
}

export async function getWineCriticUsersDAO(wineCriticId: string) {
  const found = await prisma.user.findMany({
    where: {
      wineCriticId
    },
    include: {
      wineCritic: true,
      winery: true
    }
  })
  return found as UserDAO[]
}

export async function getWineryUsersDAO(wineryId: string) {
  const found = await prisma.user.findMany({
    where: {
      wineryId
    },
    include: {
      winery: true
    }
  })
  return found as UserDAO[]
}