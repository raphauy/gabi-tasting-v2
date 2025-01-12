import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getTastingDAOBySlug } from "@/services/tasting-services"
import { getKanbanTastingDays } from "@/services/tastingday-services"
import AssociatedWineriesWrapper from "./associated-wineries-wrapper"
import Kanban from "./kanban"
import { getWinesDAOByTastingId } from "@/services/wine-services"

type Props = {
    params: Promise<{ tastingSlug: string }>
}

export default async function TastingPage({ params }: Props) {
    const { tastingSlug } = await params
    const tasting = await getTastingDAOBySlug(tastingSlug)
    const wines = await getWinesDAOByTastingId(tasting.id)
    const tastingDays= await getKanbanTastingDays(tasting.id)

    return (
        <div className="space-y-10 w-full">
            <p className="text-2xl font-bold text-center">{tasting.name}</p>            

            <Tabs defaultValue="kanban">
                <TabsList>
                    <TabsTrigger value="kanban">Kanban</TabsTrigger>
                    <TabsTrigger value="wineries">Wineries</TabsTrigger>
                </TabsList>
                <TabsContent value="kanban">
                    <Kanban tasting={tasting} initialTastingDays={tastingDays} wines={wines} />
                </TabsContent>
                <TabsContent value="wineries">
                    <AssociatedWineriesWrapper tasting={tasting} />
                </TabsContent>
            </Tabs>
        </div>
    )
}
