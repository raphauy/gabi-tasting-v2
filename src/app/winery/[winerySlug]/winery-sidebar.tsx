import { SidebarComponent } from "@/components/layout/sidebar-component"
import { getWineCriticDAOBySlug } from "@/services/winecritic-services"
import { getWineryDAOBySlug } from "@/services/winery-services"
import { getWineryMenu } from "./winery-menu"

type Props = {
    winerySlug: string
}

export async function WinerySidebar({ winerySlug }: Props) {

    const winery = await getWineryDAOBySlug(winerySlug)
    if (!winery) {
        return <div>Winery {winerySlug} not found</div>
    }
    const wineryMenu = getWineryMenu({ winerySlug })
    
    return <SidebarComponent menuGroups={wineryMenu} />
}