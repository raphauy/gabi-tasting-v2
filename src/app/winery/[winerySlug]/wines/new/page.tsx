import { WineForm } from "@/app/[wineCriticSlug]/wines/wine-forms"
import { getWineryDAOBySlug } from "@/services/winery-services"
import { notFound } from "next/navigation"

type Props= {
    params: Promise<{ winerySlug: string }>
}

export default async function NewWinePage({ params }: Props) {
    const { winerySlug } = await params
    const winery= await getWineryDAOBySlug(winerySlug)
    if (!winery) {
        return <div>{`Nose encontró la Bodega ${winerySlug}`}</div>
    }
    
    return <WineForm wineryId={winery.id} />
}