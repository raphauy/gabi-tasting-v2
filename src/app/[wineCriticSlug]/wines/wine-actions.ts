"use server"
  
import { revalidatePath } from "next/cache"
import { WineDAO, WineFormValues, createWine, updateWine, getWineDAO, deleteWine } from "@/services/wine-services"


export async function getWineDAOAction(id: string): Promise<WineDAO | null> {
    return getWineDAO(id)
}

export async function createOrUpdateWineAction(id: string | null, data: WineFormValues): Promise<WineDAO | null> {       
    let updated= null
    if (id) {
        updated= await updateWine(id, data)
    } else {
        updated= await createWine(data)
    }     

    revalidatePath("/winery/[winerySlug]/wines", "page")

    return updated as WineDAO
}

export async function deleteWineAction(id: string): Promise<WineDAO | null> {    
    const deleted= await deleteWine(id)

    revalidatePath("/winery/[winerySlug]/wines", "page")

    return deleted as WineDAO
}

