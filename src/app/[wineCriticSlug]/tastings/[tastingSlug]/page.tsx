import { columns as wineryColumns } from "@/app/[wineCriticSlug]/winerys/winery-columns"
import { DataTable as WineryDataTable } from "@/app/[wineCriticSlug]/winerys/winery-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getTastingDAOBySlug } from "@/services/tasting-services"
import { getKanbanTastingDays, getTastingDaysDAO } from "@/services/tastingday-services"
import { getWinerysDAOByTastingId } from "@/services/winery-services"
import { columns } from "./tastingdays/tastingday-columns"
import { DataTable } from "./tastingdays/tastingday-table"
import Kanban from "./kanban"

type Props = {
    params: Promise<{ tastingSlug: string }>
}

export default async function TastingPage({ params }: Props) {
    const { tastingSlug } = await params
    const tasting = await getTastingDAOBySlug(tastingSlug)

    const tastingDays= await getKanbanTastingDays(tasting.id)

    return (
        <div className="space-y-10 w-full">
            <p className="text-2xl font-bold text-center">{tasting.name}</p>            

            <Kanban tasting={tasting} initialTastingDays={tastingDays} />            
        </div>
    )
}
