"use server"
  
import { revalidatePath } from "next/cache"
import { TastingDAO, TastingFormValues, createTasting, updateTasting, getTastingDAO, deleteTasting } from "@/services/tasting-services"


export async function getTastingDAOAction(id: string): Promise<TastingDAO | null> {
    return getTastingDAO(id)
}

export async function createOrUpdateTastingAction(id: string | null, data: TastingFormValues): Promise<TastingDAO | null> {       
    let updated= null
    if (id) {
        updated= await updateTasting(id, data)
    } else {
        updated= await createTasting(data)
    }     

    revalidatePath("/[wineCriticSlug]/tastings", "layout")

    return updated as TastingDAO
}

export async function deleteTastingAction(id: string): Promise<TastingDAO | null> {    
    const deleted= await deleteTasting(id)

    revalidatePath("/[wineCriticSlug]/tastings", "layout")

    return deleted as TastingDAO
}

