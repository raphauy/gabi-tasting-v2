import { getWineCriticsDAO } from "@/services/winecritic-services"
import { WineCriticDialog } from "./winecritic-dialogs"
import { DataTable } from "./winecritic-table"
import { columns } from "./winecritic-columns"

export default async function WineCriticPage() {
  
  const data= await getWineCriticsDAO()

  return (
    <div className="w-full">      

      <div className="flex justify-end mx-auto my-2">
        <WineCriticDialog />
      </div>

      <div className="container bg-white p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white dark:bg-black">
        <DataTable columns={columns} data={data} subject="WineCritic"/>      
      </div>
    </div>
  )
}
  
