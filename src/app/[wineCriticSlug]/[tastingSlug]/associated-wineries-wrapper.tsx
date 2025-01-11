// associated-wineries.tsx
import { TastingDAO } from "@/services/tasting-services"
import { getWinerysDAOByTastingId, getWinerysDAOByWineCriticId, WineryDAO } from "@/services/winery-services"
import AssociatedWineries from "./associated-wineries"

type Props = {
    tasting: TastingDAO
}

export default async function AssociatedWineriesWrapper({ tasting }: Props) {
    const tastingWineries = await getWinerysDAOByTastingId(tasting.id)
    const allWineries = await getWinerysDAOByWineCriticId(tasting.wineCriticId)

    return (
        <AssociatedWineries tasting={tasting} tastingWineries={tastingWineries} allWineries={allWineries} />
    )
}
