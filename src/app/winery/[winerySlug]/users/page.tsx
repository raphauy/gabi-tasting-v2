import { columns } from "@/app/admin/users/user-columns"
import { UserDialog } from "@/app/admin/users/user-dialogs"
import { DataTable } from "@/app/admin/users/user-table"
import { getWineCriticUsersDAO, getWineryUsersDAO } from "@/services/user-services"
import { getWineCriticDAOBySlug } from "@/services/winecritic-services"
import { getWineryDAOBySlug } from "@/services/winery-services"
import { Role } from "@prisma/client"
import { notFound } from "next/navigation"
import { UserCard } from "../../../../components/user-card"

type Props = {
  params: Promise<{ winerySlug: string }>
}
export default async function UserPage({ params }: Props) {
  const { winerySlug } = await params

  const winery= await getWineryDAOBySlug(winerySlug)
  if (!winery) {
    return notFound()
  }
  
  const data= await getWineryUsersDAO(winery.id)

  return (
    <div className="w-full max-w-4xl mx-auto py-6">      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Usuarios de la Bodega</h1>
        <UserDialog role={Role.WINERY} wineryId={winery.id} wineCriticId={winery.wineCriticId}/>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {data.map((user) => (
          <UserCard key={user.id} user={user} fullData={false} />
        ))}
      </div>
    </div>
  )
}
