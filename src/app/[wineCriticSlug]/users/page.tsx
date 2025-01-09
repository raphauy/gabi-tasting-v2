import { columns } from "@/app/admin/users/user-columns"
import { UserDialog } from "@/app/admin/users/user-dialogs"
import { DataTable } from "@/app/admin/users/user-table"
import { getWineCriticUsersDAO } from "@/services/user-services"
import { getWineCriticsDAOBySlug } from "@/services/winecritic-services"
import { Role } from "@prisma/client"

type Props = {
  params: Promise<{ wineCriticSlug: string }>
}
export default async function UserPage({ params }: Props) {
  const { wineCriticSlug } = await params

  const wineCritic= await getWineCriticsDAOBySlug(wineCriticSlug)
  
  const data= await getWineCriticUsersDAO(wineCritic.id)

  const roles= Object.values(Role)
  
  return (
    <div className="w-full">      

      <div className="flex justify-end mx-auto my-2 gap-2">
        <UserDialog role={Role.ADMIN} wineCriticId={wineCritic.id} />
        <UserDialog role={Role.TASTER} wineCriticId={wineCritic.id} />
      </div>

      <div className="container bg-white p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white dark:bg-black">
        <DataTable columns={columns} data={data} subject="User" roles={roles}/>      
      </div>
    </div>
  )
}
