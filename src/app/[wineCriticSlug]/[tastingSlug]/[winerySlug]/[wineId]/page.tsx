import { getWineAndReviewsDAO, getWineDAO } from "@/services/wine-services"
import { WineCard } from "../../../../../components/wine-card"
import { Review } from "./review"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import CreateReviewButton from "./create-review-button"

type Props = {
    params: Promise<{ wineCriticSlug: string, tastingSlug: string, winerySlug: string, wineId: string }>
}

export default async function WinePage({ params }: Props) {
    const { wineCriticSlug, tastingSlug, winerySlug, wineId } = await params
    const wine = await getWineAndReviewsDAO(wineId)
    if (!wine) {
        return <div>Wine not found</div>
    }

    const review = wine.review
    
    return (
        <div className="space-y-4">
            <WineCard wine={wine} />

            {
                review ? <Review review={review} /> : getEmptyReviewBox(wineCriticSlug, tastingSlug, winerySlug, wineId)
            }
        </div>
    )
}

function getEmptyReviewBox(wineCriticSlug: string, tastingSlug: string, winerySlug: string, wineId: string) {
    return (
        <div className="flex items-center justify-center h-40 border-dashed border-2 rounded-md text-muted-foreground">
            <CreateReviewButton href={`/${wineCriticSlug}/${tastingSlug}/${winerySlug}/${wineId}/new`} />
        </div>
    )
}