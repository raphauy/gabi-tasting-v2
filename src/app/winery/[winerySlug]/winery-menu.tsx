import { MenuGroup } from "@/lib/utils"
import { getTastingsDAO, TastingDAO } from "@/services/tasting-services"
import { getWineCriticDAOBySlug } from "@/services/winecritic-services"
import { BookOpenCheck, Building2, Calendar, LayoutDashboard, Users, Wine } from "lucide-react"

type Props = {
  winerySlug: string
}

export function getWineryMenu({ winerySlug }: Props): MenuGroup[] {

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
          name: "Wines",
          icon: <Wine className="h-4 w-4" />,
          href: `/winery/${winerySlug}/wines`,
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
