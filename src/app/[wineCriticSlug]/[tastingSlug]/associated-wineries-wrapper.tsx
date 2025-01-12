// associated-wineries.tsx
import { TastingDAO } from "@/services/tasting-services"
import { getWinerysDAOByTastingId, getWinerysDAOByWineCriticId, WineryDAO } from "@/services/winery-services"
import AssociatedWineries from "./associated-wineries"
import { WineryDialog } from "../winerys/winery-dialogs"

type Props = {
    tasting: TastingDAO
}

export default async function AssociatedWineriesWrapper({ tasting }: Props) {
    const tastingWineries = await getWinerysDAOByTastingId(tasting.id)
    const allWineries = await getWinerysDAOByWineCriticId(tasting.wineCriticId)

    return (
        <div className="w-full">
            <div className="flex justify-end mx-auto my-2">
                <WineryDialog wineCriticId={tasting.wineCriticId} />
            </div>

            <AssociatedWineries tasting={tasting} tastingWineries={tastingWineries} allWineries={allWineries} />
        </div>
    )
}
