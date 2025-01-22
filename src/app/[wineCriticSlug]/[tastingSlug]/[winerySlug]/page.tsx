import { WineCard } from "@/components/wine-card"
import { getTastingDAOBySlug } from "@/services/tasting-services"
import { getWinesAndReviewsDAOByWineryAndTasting, getWinesDAOByWineryAndTasting } from "@/services/wine-services"
import { getWineryDAOBySlug } from "@/services/winery-services"
import { ReviewWineCard } from "./[wineId]/review-wine-card"

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
            <p className="text-2xl font-bold text-center">{tasting.name} - {winery.name}</p>

            <div className="w-full max-w-5xl mx-auto py-6 ">      
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 place-items-center">
                    {wines.map((wine) => (
                        <ReviewWineCard 
                            key={wine.id} 
                            wine={wine} 
                            href={`/${wineCriticSlug}/${tastingSlug}/${winerySlug}/${wine.id}`} 
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}