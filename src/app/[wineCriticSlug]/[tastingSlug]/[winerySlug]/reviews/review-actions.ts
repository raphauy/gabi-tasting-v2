"use server"
  
import { generateAIText } from "@/services/ai-services"
import { ReviewDAO, ReviewFormValues, createReview, deleteReview, getReviewDAO, setField, setTastingNote, updateReview } from "@/services/review-services"
import { getWineCriticTastingNotePrompt } from "@/services/winecritic-services"
import { revalidatePath } from "next/cache"


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

export async function setTastingNoteAction(id: string, tastingNote: string): Promise<boolean> {
    const updated= await setTastingNote(id, tastingNote)
    revalidatePath("/[wineCriticSlug]/[tastingSlug]/[winerySlug]", "page")
    
    return updated !== null
}

export async function generateTastingNoteAction(id: string, wineCriticSlug: string): Promise<string> {
    const review= await getReviewDAO(id)
    if (!review) {
        throw new Error("Review not found")
    }
    console.log(review)
    const wineCriticTastingNotePrompt= await getWineCriticTastingNotePrompt(wineCriticSlug)
    const system= wineCriticTastingNotePrompt + tastingNoteFormat
    const prompt= `Generates a Tasting Note with direct html tags (without markdown) for the wine ${review.wine.name} based on the following data: ${JSON.stringify(review)}`

    const tastingNote= await generateAIText(system, prompt)
    console.log(tastingNote)
    return tastingNote
}

const tastingNoteFormat= "\n\nFormat example: <h2>Bohemian by Fiore 2023</h2><p>Red plum and sour cherry notes, accompanied by hints of pink grapefruit and orange zest, are highlighted in this 2020 wine from Viña Progreso. Subtle touches of vanilla and cardamom emerge from its 8-10 months of ageing in a combination of one new and three used barrels, with smooth tannins adding to its overall balance.</p>"