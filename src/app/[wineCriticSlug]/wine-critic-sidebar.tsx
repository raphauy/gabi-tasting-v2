import { getTastingsDAO } from "@/services/tasting-services"
import { getWineCriticDAOBySlug } from "@/services/winecritic-services"
import { getwineCriticMenu } from "./wine-critic-menu"
import { SidebarComponent } from "@/components/layout/sidebar-component"

type Props = {
    wineCriticSlug: string
}

export async function WineCriticSidebar({ wineCriticSlug }: Props) {
    const wineCritic = await getWineCriticDAOBySlug(wineCriticSlug)
    if (!wineCritic) {
        return <div>Wine critic {wineCriticSlug} not found</div>
    }
    const tastings = await getTastingsDAO(wineCritic.id)
    const wineCriticMenu = getwineCriticMenu({ wineCriticSlug, tastings })
    return <SidebarComponent menuGroups={wineCriticMenu} />
}