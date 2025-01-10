import { getTastingDAOBySlug } from "@/services/tasting-services"
import { getTastingDaysDAO } from "@/services/tastingday-services"
import { columns } from "./tastingday-columns"
import { TastingDayDialog } from "./tastingday-dialogs"
import { DataTable } from "./tastingday-table"

type Props = {
  params: Promise<{tastingSlug: string}>
}
export default async function TastingDayPage({ params }: Props) {
  const {tastingSlug} = await params
  
  const tasting = await getTastingDAOBySlug(tastingSlug)
  const data= await getTastingDaysDAO(tasting.id)

  return (
    <div className="w-full">      

      

      <div className="flex justify-between mx-auto my-2">
        <p className="text-xl font-bold">Tasting days of {tasting.name}</p>
        <TastingDayDialog tastingId={tasting.id} />
      </div>

      <div className="container bg-white p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white dark:bg-black">
        <DataTable columns={columns} data={data} subject="TastingDay"/>      
      </div>
    </div>
  )
}
  
