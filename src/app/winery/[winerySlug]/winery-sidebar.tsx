import { SidebarComponent } from "@/components/layout/sidebar-component"
import { MenuGroup } from "@/lib/utils"
import { getWinesDAOByWinerySlug, WineDAO } from "@/services/wine-services"
import { Users } from "lucide-react"
import { Wine } from "lucide-react"
import { LayoutDashboard } from "lucide-react"

type Props = {
    winerySlug: string
}

export async function WinerySidebar({ winerySlug }: Props) {
    const wines= await getWinesDAOByWinerySlug(winerySlug)
    return <SidebarComponent menuGroups={getWineryMenu(winerySlug, wines)} />
}

export function getWineryMenu(winerySlug: string, wines: WineDAO[]): MenuGroup[] {

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
              href: `/winery/${winerySlug}/wines/${wine.id}`,
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
  