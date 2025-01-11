import { WineForm } from "@/app/[wineCriticSlug]/wines/wine-forms"
import { getWineDAO } from "@/services/wine-services"

type Props= {
    params: Promise<{ winerySlug: string, wineId: string }>
}

export default async function WinePage({ params }: Props) {
    const { winerySlug, wineId } = await params
    const wine= await getWineDAO(wineId)
    if (!wine) {
        return <div>{`No se encontró el vino ${wineId}`}</div>
    }
    return (
        <div className="flex flex-col gap-4 space-y-4">
            <p className="text-2xl font-bold text-center">{wine.name}</p>
            <p className="text-center text-muted-foreground mb-2">{wine.tastings[0].name} - {wine.winery.name}</p>
            <WineForm wineryId={wine.winery.id} id={wineId} tastingId={wine.tastings[0].id}/>
        </div>
    )
}