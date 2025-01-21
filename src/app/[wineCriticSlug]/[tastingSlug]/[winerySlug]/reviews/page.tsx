import { getReviewsDAO } from "@/services/review-services"
import { ReviewDialog } from "./review-dialogs"
import { DataTable } from "./review-table"
import { columns } from "./review-columns"

export default async function ReviewPage() {
  
  const data= await getReviewsDAO()

  return (
    <div className="w-full">      

      <div className="flex justify-end mx-auto my-2">
        <ReviewDialog />
      </div>

      <div className="container bg-white p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white dark:bg-black">
        <DataTable columns={columns} data={data} subject="Review"/>      
      </div>
    </div>
  )
}
  
