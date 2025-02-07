"use server"
  
import { revalidatePath } from "next/cache"
import { WineCriticDAO, WineCriticFormValues, createWineCritic, updateWineCritic, getWineCriticDAO, deleteWineCritic, getWineCriticNameBySlug, getWineCriticTastingNotePrompt, setWineCriticTastingNotePrompt } from "@/services/winecritic-services"


export async function getWineCriticDAOAction(id: string): Promise<WineCriticDAO | null> {
    return getWineCriticDAO(id)
}

export async function createOrUpdateWineCriticAction(id: string | null, data: WineCriticFormValues): Promise<WineCriticDAO | null> {       
    let updated= null
    if (id) {
        updated= await updateWineCritic(id, data)
    } else {
        updated= await createWineCritic(data)
    }     

    revalidatePath("/admin/wineCritics")

    return updated as WineCriticDAO
}

export async function deleteWineCriticAction(id: string): Promise<WineCriticDAO | null> {    
    const deleted= await deleteWineCritic(id)

    revalidatePath("/admin/wineCritics")

    return deleted as WineCriticDAO
}

export async function getWineCriticNameBySlugAction(slug: string): Promise<string> {
    const name = await getWineCriticNameBySlug(slug)
    return name || ""
}

export async function getWineCriticTastingNotePromptAction(slug: string): Promise<string> {
    const tastingNotePrompt = await getWineCriticTastingNotePrompt(slug)
    return tastingNotePrompt || ""
}

export async function setWineCriticTastingNotePromptAction(slug: string, tastingNotePrompt: string): Promise<boolean> {
    const updated = await setWineCriticTastingNotePrompt(slug, tastingNotePrompt)
    return updated !== null
}