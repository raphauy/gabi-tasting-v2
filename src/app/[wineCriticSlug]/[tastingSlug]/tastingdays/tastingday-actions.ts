"use server"
  
import { revalidatePath } from "next/cache"
import { TastingDayDAO, TastingDayFormValues, createTastingDay, updateTastingDay, getTastingDayDAO, deleteTastingDay, updateKanbanTastingDays, KanbanTastingDayDAO } from "@/services/tastingday-services"
import { WineryTastingDAO } from "@/services/winerytasting-services"
import { TastingDayWineryDAO, updateKanbanTastingDaysWineries } from "@/services/tastingdaywinery-services"


export async function getTastingDayDAOAction(id: string): Promise<TastingDayDAO | null> {
    return getTastingDayDAO(id)
}

export async function createOrUpdateTastingDayAction(id: string | null, data: TastingDayFormValues): Promise<TastingDayDAO | null> {       
    let updated= null
    if (id) {
        updated= await updateTastingDay(id, data)
    } else {
        updated= await createTastingDay(data)
    }     

    revalidatePath("/[wineCriticSlug]/tastings/[tastingSlug]", "page")

    return updated as TastingDayDAO
}

export async function deleteTastingDayAction(id: string): Promise<TastingDayDAO | null> {    
    const deleted= await deleteTastingDay(id)

    revalidatePath("/[wineCriticSlug]/tastings/[tastingSlug]", "page")

    return deleted as TastingDayDAO
}

export async function updateKanbanTastingDaysAction(tastingId: string, tastingDays: KanbanTastingDayDAO[]) {
    const updated= await updateKanbanTastingDays(tastingId, tastingDays)

    revalidatePath("/[wineCriticSlug]/tastings/[tastingSlug]", "page")

    return updated
}

export async function updateTastingDaysWineriesAction(wineries: TastingDayWineryDAO[]) {
    const updated= await updateKanbanTastingDaysWineries(wineries)

    revalidatePath("/client/[slug]/crm", "page")

    return updated
}