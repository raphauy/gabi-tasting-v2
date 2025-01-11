import { getWinesDAO } from "@/services/wine-services"
import { WineDialog } from "./wine-dialogs"
import { DataTable } from "./wine-table"
import { columns } from "./wine-columns"

export default async function WinePage() {
  
  const data= await getWinesDAO()

  return (
    <div className="w-full space-y-4">      

      <p className="text-2xl font-bold text-center">Wines</p>

      <div className="container bg-white p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white dark:bg-black">
        <DataTable columns={columns} data={data} subject="Wine"/>      
      </div>
    </div>
  )
}
  
