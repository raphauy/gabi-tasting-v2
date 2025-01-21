import { getTastingDAOBySlug } from "@/services/tasting-services"
import { getWineryDAOBySlug } from "@/services/winery-services"

type Props = {
    params: Promise<{ tastingSlug: string, winerySlug: string }>
}

export default async function WineryPage({ params }: Props) {
    const { tastingSlug, winerySlug } = await params
    const tasting = await getTastingDAOBySlug(tastingSlug)
    const winery = await getWineryDAOBySlug(winerySlug)

    return (
        <div className=" bg-green-100">
            <p className="text-2xl font-bold text-center">{tasting.name} - {winery.name}</p>
        </div>
    )
}