"use server"
  
import { revalidatePath } from "next/cache"
import { UserDAO, UserFormValues, createUser, updateUser, getUserDAO, deleteUser } from "@/services/user-services"
import { getCurrentUser } from "@/lib/utils"
import { sendWineryUserInvite } from "@/services/email-services"


export async function getUserDAOAction(id: string): Promise<UserDAO | null> {
    return getUserDAO(id)
}

export async function createOrUpdateUserAction(id: string | null, data: UserFormValues): Promise<UserDAO | null> {       
    let updated= null
    if (id) {
        updated= await updateUser(id, data)
    } else {
        updated= await createUser(data)
        if (updated) {
            const winery = updated.winery;
            let wineryName = "Bodega"
            if (winery) {
              wineryName = winery.name;
            }
            const currentUser = await getCurrentUser();
            if (!currentUser) {
              throw new Error("Current user not found");
            }
            const inviterName= currentUser.name || currentUser.email;
            const invitedName= updated.name || updated.email;
            const serverUrl = process.env.NEXTAUTH_URL;
            const ctaLink = serverUrl + "/login?email=" + updated.email;
            const result = await sendWineryUserInvite(updated.email, inviterName, invitedName, wineryName, ctaLink);
            if (!result.success) {
              console.error("Error sending invite email", result.error);
            } else {
              console.log("Invite email sent successfully");
            }
        } else {
            console.log("Error creating user", updated);
        }
        
    }     

    revalidatePath("/admin/users")

    return updated as UserDAO
}

export async function deleteUserAction(id: string): Promise<UserDAO | null> {    
    const deleted= await deleteUser(id)

    revalidatePath("/admin/users")

    return deleted as UserDAO
}

