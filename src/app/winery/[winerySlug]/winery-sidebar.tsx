import { SidebarComponent } from "@/components/layout/sidebar-component"
import { MenuGroup } from "@/lib/utils"
import { getTastingsDAOByWinerySlug, TastingDAO } from "@/services/tasting-services"
import { getWinesDAOByWinerySlug, WineDAO } from "@/services/wine-services"
import { getWineryNameBySlug } from "@/services/winery-services"
import { Glasses, Users, Wine } from "lucide-react"

type Props = {
    winerySlug: string
}

export async function WinerySidebar({ winerySlug }: Props) {
    const wineryName= await getWineryNameBySlug(winerySlug) || "Bodega"
    const wines= await getWinesDAOByWinerySlug(winerySlug)
    const tastings= await getTastingsDAOByWinerySlug(winerySlug)
    return <SidebarComponent menuGroups={getWineryMenu(winerySlug, wineryName, wines, tastings)} />
}

export function getWineryMenu(winerySlug: string, wineryName: string, wines: WineDAO[], tastings: TastingDAO[]): MenuGroup[] {

    return [
      {
        name: `${wineryName}`,
        items: [
          {
            name: " Tastings",
            icon: <Glasses className="h-4 w-4" />,
            subItems: tastings.map(tasting => ({
              label: tasting.name,
              href: `/winery/${winerySlug}/${tasting.slug}`,
            })),
          },
          {
            name: "Vinos",
            icon: <Wine className="h-4 w-4" />,
            //href: `/winery/${winerySlug}/wines`,
            subItems: wines.map(wine => ({
              label: wine.name,
              href: `/winery/${winerySlug}/${wine.tastings[0].slug}/${wine.id}`,
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
  