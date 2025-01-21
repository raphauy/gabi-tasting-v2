"use server"
  
import { revalidatePath } from "next/cache"
import { ReviewDAO, ReviewFormValues, createReview, updateReview, getReviewDAO, deleteReview, setField } from "@/services/review-services"


export async function getReviewDAOAction(id: string): Promise<ReviewDAO | null> {
    return getReviewDAO(id)
}

export async function createOrUpdateReviewAction(id: string | null, data: ReviewFormValues): Promise<ReviewDAO | null> {       
    let updated= null
    if (id) {
        updated= await updateReview(id, data)
    } else {
        updated= await createReview(data)
    }     

    revalidatePath("/[wineCriticSlug]/[tastingSlug]/[winerySlug]", "page")

    return updated as ReviewDAO
}

export async function deleteReviewAction(id: string): Promise<ReviewDAO | null> {    
    const deleted= await deleteReview(id)

    revalidatePath("/[wineCriticSlug]/[tastingSlug]/[winerySlug]", "page")

    return deleted as ReviewDAO
}

export async function setFieldAction(id: string, name: string, value: string | number | boolean | undefined): Promise<boolean> {
    const updated= await setField(id, name, value)

    revalidatePath("/[wineCriticSlug]/[tastingSlug]/[winerySlug]", "page")
    
    return updated !== null
}