"use server"
  
import { revalidatePath } from "next/cache"
import { WineryDAO, WineryFormValues, createWinery, updateWinery, getWineryDAO, deleteWinery, addWineryToTasting, removeWineryFromTasting } from "@/services/winery-services"
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

export async function addAllWineriesToTasting(tastingId: string, wineryIds: string[]) {
    // Implementa la lógica para agregar todas las bodegas al tasting en la base de datos
    console.log("Agregando todas las bodegas al tasting", tastingId)
    // Ejemplo: await db.tasting.update({ where: { id: tastingId }, data: { wineries: { connect: wineryIds.map(id => ({ id })) } } })
    revalidatePath(`/tastings/${tastingId}`)
}

export async function removeAllWineriesFromTasting(tastingId: string) {
    // Implementa la lógica para quitar todas las bodegas del tasting en la base de datos
    console.log("Quitando todas las bodegas del tasting", tastingId)
    // Ejemplo: await db.tasting.update({ where: { id: tastingId }, data: { wineries: { set: [] } } })
    revalidatePath(`/tastings/${tastingId}`)
}