import { getTastingDAOBySlug } from "@/services/tasting-services"
import { getWinesAndReviewsDAOByWineryAndTasting } from "@/services/wine-services"
import { getWineryDAOBySlug } from "@/services/winery-services"
import { WineList } from "./wine-list"

type Props = {
    params: Promise<{ wineCriticSlug: string, tastingSlug: string, winerySlug: string }>
}

export default async function WineryPage({ params }: Props) {
    const { wineCriticSlug, tastingSlug, winerySlug } = await params
    const tasting = await getTastingDAOBySlug(tastingSlug)
    const winery = await getWineryDAOBySlug(winerySlug)

    const wines = await getWinesAndReviewsDAOByWineryAndTasting(winery.id, tasting.id)

    return (
        <div className="">
            <p className="text-xl font-bold text-center">{tasting.name} - {winery.name}</p>

            <WineList wines={wines} basePath={`/${wineCriticSlug}/${tastingSlug}/${winerySlug}`} />
            
        </div>
    )
}