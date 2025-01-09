import { getWinerysDAO } from "@/services/winery-services"
import { WineryDialog } from "./winery-dialogs"
import { DataTable } from "./winery-table"
import { columns } from "./winery-columns"

export default async function WineryPage() {
  
  const data= await getWinerysDAO()

  return (
    <div className="w-full">      

      <div className="flex justify-end mx-auto my-2">
        <WineryDialog />
      </div>

      <div className="container bg-white p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white dark:bg-black">
        <DataTable columns={columns} data={data} subject="Winery"/>      
      </div>
    </div>
  )
}
  
