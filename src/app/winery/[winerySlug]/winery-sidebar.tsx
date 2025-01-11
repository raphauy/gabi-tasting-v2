import { SidebarComponent } from "@/components/layout/sidebar-component"
import { MenuGroup } from "@/lib/utils"
import { getTastingsDAOByWinerySlug, TastingDAO } from "@/services/tasting-services"
import { getWinesDAOByWinerySlug, WineDAO } from "@/services/wine-services"
import { Glasses, Users } from "lucide-react"
import { Wine } from "lucide-react"
import { LayoutDashboard } from "lucide-react"

type Props = {
    winerySlug: string
}

export async function WinerySidebar({ winerySlug }: Props) {
    const wines= await getWinesDAOByWinerySlug(winerySlug)
    const tastings= await getTastingsDAOByWinerySlug(winerySlug)
    return <SidebarComponent menuGroups={getWineryMenu(winerySlug, wines, tastings)} />
}

export function getWineryMenu(winerySlug: string, wines: WineDAO[], tastings: TastingDAO[]): MenuGroup[] {

    return [
      {
        name: "Winery",
        items: [
          {
            name: "Dashboard",
            icon: <LayoutDashboard className="h-4 w-4" />,
            href: `/winery/${winerySlug}`,
          },
          {
            name: "Vinos",
            icon: <Wine className="h-4 w-4" />,
            href: `/winery/${winerySlug}/wines`,
            subItems: wines.map(wine => ({
              label: wine.name,
              href: `/winery/${winerySlug}/${wine.tastings[0].slug}/${wine.id}`,
            })),
          },
          {
            name: "Tastings",
            icon: <Glasses className="h-4 w-4" />,
            href: `/winery/${winerySlug}/tastings`,
            subItems: tastings.map(tasting => ({
              label: tasting.name,
              href: `/winery/${winerySlug}/${tasting.slug}`,
            })),
          },
        ],
      },
      {
        name: "Configuración",
        items: [
          {
            name: "Usuarios",
            icon: <Users className="h-4 w-4" />,
            href: `/winery/${winerySlug}/users`,
          },
        ],
      },
    ]
  }
  