import { columns } from "@/app/[wineCriticSlug]/wines/wine-columns"
import { WineDialog } from "@/app/[wineCriticSlug]/wines/wine-dialogs"
import { DataTable } from "@/app/[wineCriticSlug]/wines/wine-table"
import { Button } from "@/components/ui/button"
import { getWinesDAO, getWinesDAOByWineryId } from "@/services/wine-services"
import { getWineryDAOBySlug } from "@/services/winery-services"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

type Props = {
  params: Promise<{ winerySlug: string }>
}

export default async function WinePage({ params }: Props) {
  const { winerySlug } = await params
  const winery = await getWineryDAOBySlug(winerySlug)
  if (!winery) {
    return notFound()
  }
  const data= await getWinesDAOByWineryId(winery.id)

  return (
    <div className="w-full">      

      <div className="flex justify-end mx-auto my-2">
        <Link href={`/winery/${winerySlug}/wines/new`}>
          <Button>
            <PlusCircle size={22} className="mr-2"/>
            Agregar Vino
          </Button>
        </Link>
      </div>

      <div className="container bg-white p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white dark:bg-black">
        <DataTable columns={columns} data={data} subject="Wine"/>      
      </div>
    </div>
  )
}
  
