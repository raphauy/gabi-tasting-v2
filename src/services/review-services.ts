import * as z from "zod"
import { prisma } from "@/lib/db"
import { WineDAO } from "./wine-services"

export type ReviewDAO = {
	id: string
	intensity: string | undefined
	colour: string | undefined
	aromaIntensity: string | undefined
	aromaPrimary: string | undefined
	aromaSecondary: string | undefined
	aromaTertiary: string | undefined
	sweetness: string | undefined
	acidity: string | undefined
	alcohol: string | undefined
	tannins: string | undefined
	body: string | undefined
	flavourIntensity: string | undefined
	flavourCharacteristics: string | undefined
	score: number | undefined
	comments: string | undefined
	finished: boolean
	wineId: string
	wine: WineDAO
	createdAt: Date
	updatedAt: Date
}

export const ReviewSchema = z.object({
	intensity: z.string().optional(),
	colour: z.string().optional(),
	aromaIntensity: z.string().optional(),
	aromaPrimary: z.string().optional(),
	aromaSecondary: z.string().optional(),
	aromaTertiary: z.string().optional(),
	sweetness: z.string().optional(),
	acidity: z.string().optional(),
	alcohol: z.string().optional(),
	tannins: z.string().optional(),
	body: z.string().optional(),
	flavourIntensity: z.string().optional(),
	flavourCharacteristics: z.string().optional(),
	score: z.number().optional(),
	comments: z.string().optional(),
	wineId: z.string().min(1, "wineId is required."),
	finished: z.boolean().optional(),
})

export type ReviewFormValues = z.infer<typeof ReviewSchema>


export async function getReviewsDAO() {
  const found = await prisma.review.findMany({
    orderBy: {
      id: 'asc'
    },
  })
  return found as ReviewDAO[]
}

export async function getReviewDAO(id: string) {
  const found = await prisma.review.findUnique({
    where: {
      id
    },
  })
  return found as ReviewDAO
}


    
export async function createReview(data: ReviewFormValues) {
  const created = await prisma.review.create({
    data
  })
  return created
}

export async function createEmptyReview(wineId: string) {
  const created = await prisma.review.create({
    data: {
      wineId
    }
  })
  return created
}

export async function updateReview(id: string, data: ReviewFormValues) {
  const updated = await prisma.review.update({
    where: {
      id
    },
    data
  })
  return updated
}

export async function deleteReview(id: string) {
  const deleted = await prisma.review.delete({
    where: {
      id
    },
  })
  return deleted
}

export async function setField(id: string, name: string, value: string | number | boolean | undefined) {
  const updated = await prisma.review.update({
    where: {
      id
    },
    data: {
      [name]: value
    }
  })
  return updated
}
