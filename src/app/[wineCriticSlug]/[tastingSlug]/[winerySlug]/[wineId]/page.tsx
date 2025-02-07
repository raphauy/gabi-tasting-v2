import { getTastingIdBySlug } from "@/services/tasting-services"
import { getWineAndReviewsDAO } from "@/services/wine-services"
import { WineCard } from "../../../../../components/wine-card"
import CreateReviewButton from "./create-review-button"
import { Review } from "./review"
import { TastingNoteBox } from "./tasting-note-box"

type Props = {
    params: Promise<{ wineCriticSlug: string, tastingSlug: string, winerySlug: string, wineId: string }>
}

export default async function WinePage({ params }: Props) {
    const { wineCriticSlug, tastingSlug, winerySlug, wineId } = await params
    const wine = await getWineAndReviewsDAO(wineId)
    if (!wine) {
        return <div>Wine not found</div>
    }
    const tastingId = await getTastingIdBySlug(tastingSlug)
    if (!tastingId) {
        return <div>Tasting not found</div>
    }

    const review = wine.review
    
    return (
        <div className="space-y-4">
            <WineCard wine={wine} tastingId={tastingId} />

            {
                review ? (
                    <div className="space-y-10">
                        <Review review={review} />
                        <TastingNoteBox reviewId={review.id} initialTastingNote={review.tastingNote || ""} wineCriticSlug={wineCriticSlug} />
                    </div>
                )
                : getEmptyReviewBox(wineCriticSlug, tastingSlug, winerySlug, wineId)
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