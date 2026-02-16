import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getTastingDAOBySlug } from "@/services/tasting-services"
import { getKanbanTastingDays } from "@/services/tastingday-services"
import AssociatedWineriesWrapper from "./associated-wineries-wrapper"
import Kanban from "./kanban"
import { getWinesDAOByTastingId } from "@/services/wine-services"
import ReportWrapper from "./report-wrapper"

type Props = {
    params: Promise<{ tastingSlug: string }>
    searchParams: Promise<{
        wineryId?: string
    }>
}

export default async function TastingPage({ params, searchParams }: Props) {
    const { tastingSlug } = await params
    const tasting = await getTastingDAOBySlug(tastingSlug)
    const wines = await getWinesDAOByTastingId(tasting.id)
    const tastingDays= await getKanbanTastingDays(tasting.id)

    return (
        <div className="space-y-6 w-full">
            <p className="text-xl font-bold text-center">{tasting.name}</p>

            <Tabs defaultValue="kanban">
                <TabsList>
                    <TabsTrigger value="kanban">Kanban</TabsTrigger>
                    <TabsTrigger value="wineries">Wineries</TabsTrigger>
                    <TabsTrigger value="reports">Reports</TabsTrigger>
                </TabsList>
                <TabsContent value="kanban">
                    <Kanban tasting={tasting} initialTastingDays={tastingDays} wines={wines} />
                </TabsContent>
                <TabsContent value="wineries">
                    <AssociatedWineriesWrapper tasting={tasting} />
                </TabsContent>
                <TabsContent value="reports">
                    <ReportWrapper tasting={tasting} searchParams={await searchParams} />
                </TabsContent>
            </Tabs>
        </div>
    )
}
