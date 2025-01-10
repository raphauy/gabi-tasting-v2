import { getWinerysDAO } from "@/services/winery-services"
import { WineryDialog } from "./winery-dialogs"
import { DataTable } from "./winery-table"
import { columns } from "./winery-columns"
import { getWineCriticDAO, getWineCriticDAOBySlug } from "@/services/winecritic-services"
import { notFound } from "next/navigation"

type Props = {
  params: Promise<{ wineCriticSlug: string }>
}

export default async function WineryPage({ params }: Props) {
  const { wineCriticSlug } = await params
  const wineCritic = await getWineCriticDAOBySlug(wineCriticSlug)

  if (!wineCritic) {
    return notFound()
  }
  
  const data= await getWinerysDAO(wineCritic.id)

  return (
    <div className="w-full">      

      <div className="flex justify-end mx-auto my-2">
        <WineryDialog wineCriticId={wineCritic.id} />
      </div>

      <div className="container bg-white p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white dark:bg-black">
        <DataTable columns={columns} data={data} subject="Winery"/>      
      </div>
    </div>
  )
}
  
