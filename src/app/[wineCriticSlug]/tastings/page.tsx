import { getTastingsDAO } from "@/services/tasting-services"
import { TastingDialog } from "./tasting-dialogs"
import { DataTable } from "./tasting-table"
import { columns } from "./tasting-columns"
import { getWineCriticDAOBySlug } from "@/services/winecritic-services"
import { notFound } from "next/navigation"

type Props = {
  params: Promise<{ wineCriticSlug: string }>
}

export default async function TastingPage({ params }: Props) {
  
  const { wineCriticSlug }= await params

  const wineCritic= await getWineCriticDAOBySlug(wineCriticSlug)

  if (!wineCritic) {
    return notFound()
  }

  const data= await getTastingsDAO(wineCritic.id)

  return (
    <div className="w-full">      

      <div className="flex justify-end mx-auto my-2">
        <TastingDialog wineCriticId={wineCritic.id} />
      </div>

      <div className="container bg-white p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white dark:bg-black">
        <DataTable columns={columns} data={data} subject="Tasting"/>      
      </div>
    </div>
  )
}
  
