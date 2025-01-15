import { WineForm } from "@/app/[wineCriticSlug]/wines/wine-forms"
import { FileUpload } from "@/components/file-upload"
import { getTastingDAOBySlug } from "@/services/tasting-services"
import { getWineryDAOBySlug } from "@/services/winery-services"
import { notFound } from "next/navigation"

type Props= {
    params: Promise<{ winerySlug: string, tastingSlug: string }>
}

export default async function NewWinePage({ params }: Props) {
    const { winerySlug, tastingSlug } = await params
    const winery= await getWineryDAOBySlug(winerySlug)
    if (!winery) {
        return <div>{`Nose encontró la Bodega ${winerySlug}`}</div>
    }
    const tasting= await getTastingDAOBySlug(tastingSlug)
    if (!tasting) {
        return <div>{`Nose encontró el tasting ${tastingSlug}`}</div>
    }
    return (
        <div className="space-y-2">
            <p className="text-2xl font-bold text-center">Agregar Vino</p>
            <p className="text-center text-muted-foreground mb-2">{tasting.name} - {winery.name}</p>
            <WineForm wineryId={winery.id} tastingId={tasting.id} />
        </div>
    )
}
