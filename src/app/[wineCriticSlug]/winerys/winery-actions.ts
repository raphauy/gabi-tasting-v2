"use server"
  
import { revalidatePath } from "next/cache"
import { WineryDAO, WineryFormValues, createWinery, updateWinery, getWineryDAO, deleteWinery } from "@/services/winery-services"


export async function getWineryDAOAction(id: string): Promise<WineryDAO | null> {
    return getWineryDAO(id)
}

export async function createOrUpdateWineryAction(id: string | null, data: WineryFormValues): Promise<WineryDAO | null> {       
    let updated= null
    if (id) {
        updated= await updateWinery(id, data)
    } else {
        updated= await createWinery(data)
    }     

    revalidatePath("/[tastingSlug]/winerys")

    return updated as WineryDAO
}

export async function deleteWineryAction(id: string): Promise<WineryDAO | null> {    
    const deleted= await deleteWinery(id)

    revalidatePath("/[tastingSlug]/winerys")

    return deleted as WineryDAO
}

