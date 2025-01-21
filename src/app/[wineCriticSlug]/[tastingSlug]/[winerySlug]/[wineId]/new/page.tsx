import { createEmptyReview } from "@/services/review-services"
import { redirect } from "next/navigation"

type Props = {
    params: Promise<{ wineCriticSlug: string, tastingSlug: string, winerySlug: string, wineId: string }>
}

export default async function NewReviewPage({ params }: Props) {
    const { wineCriticSlug, tastingSlug, winerySlug, wineId } = await params
    const review = await createEmptyReview(wineId)

    if (!review) {
        return <div>Error al crear la review</div>
    }

    redirect(`/${wineCriticSlug}/${tastingSlug}/${winerySlug}/${wineId}`)
}