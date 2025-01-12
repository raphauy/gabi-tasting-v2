import { auth } from "@/lib/auth"
import { EditableField } from "@/components/editable-field"
import { updateUserAvatar, updateUserName } from "./actions"
import { getUserDAO } from "@/services/user-services"
import { AvatarField } from "@/components/avatar-field"
import { getCurrentUser } from "@/lib/utils"

export default async function AccountPage() {
  const sessionUser = await getCurrentUser()
  if (!sessionUser?.id) {
    console.log("No user id, user: ", sessionUser)
    return null
  }

  const user = await getUserDAO(sessionUser.id)

  return (
    <div className="mx-auto p-6 w-full">
      <h1 className="text-2xl text-center font-bold mb-6">Perfil de Usuario</h1>
      
      <div className="space-y-4">
        <EditableField
            label="Nombre"
            description="Por favor, ingresa tu nombre o un nombre que te resulte cómodo."
            value={user.name || ""}
            maxLength={32}
            onUpdate={updateUserName}
        />

        <AvatarField 
            label="Avatar"
            description="Este es tu avatar."
            imageUrl={user.image} 
            onUpdate={updateUserAvatar} 
            />
      </div>
    </div>
  )
}