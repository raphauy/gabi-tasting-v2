"use server"
  
import { revalidatePath } from "next/cache"
import { WineryDAO, WineryFormValues, createWinery, updateWinery, getWineryDAO, deleteWinery, addWineryToTasting, removeWineryFromTasting, addAllWineriesToTasting, removeAllWineriesFromTasting } from "@/services/winery-services"
import { WineryTastingDAO } from "@/services/winerytasting-services"


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

    revalidatePath("/[wineCriticSlug]", "page")

    return updated as WineryDAO
}

export async function deleteWineryAction(id: string): Promise<WineryDAO | null> {    
    const deleted= await deleteWinery(id)

    revalidatePath("/[wineCriticSlug]", "page")

    return deleted as WineryDAO
}

export async function addWineryToTastingAction(tastingId: string, wineryId: string): Promise<boolean> {
    console.log("Agregando bodega", wineryId, "al tasting", tastingId)
    const added= await addWineryToTasting(tastingId, wineryId)
    if (added) {
        revalidatePath("/[wineCriticSlug]", "page")
        return true
    } else {
        return false
    }
}

export async function removeWineryFromTastingAction(tastingId: string, wineryId: string): Promise<boolean> {
    console.log("Quitando bodega", wineryId, "del tasting", tastingId)
    const removed= await removeWineryFromTasting(tastingId, wineryId)
    if (removed) {
        revalidatePath("/[wineCriticSlug]", "page")
        return true
    } else {
        return false
    }
}

export async function addAllWineriesToTastingAction(tastingId: string, wineryIds: string[]) {
    console.log("Agregando todas las bodegas al tasting", tastingId)
    const added= await addAllWineriesToTasting(tastingId, wineryIds)
    if (added) {
        revalidatePath("/[wineCriticSlug]", "page")
        return true
    } else {
        return false
    }
}

export async function removeAllWineriesFromTastingAction(tastingId: string) {
    console.log("Quitando todas las bodegas del tasting", tastingId)
    const removed= await removeAllWineriesFromTasting(tastingId)
    if (removed) {
        revalidatePath("/[wineCriticSlug]", "page")
        return true
    } else {
        return false
    }
}