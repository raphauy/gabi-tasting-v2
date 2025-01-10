import { MenuGroup } from "@/lib/utils"
import { getTastingsDAO, TastingDAO } from "@/services/tasting-services"
import { getWineCriticsDAOBySlug } from "@/services/winecritic-services"
import { BookOpenCheck, Building2, LayoutDashboard, Users } from "lucide-react"

type Props = {
  wineCriticSlug: string
  tastings: TastingDAO[]
}

export function getwineCriticMenu({ wineCriticSlug, tastings }: Props): MenuGroup[] {

  return [
    {
      name: "Wine Critic",
      items: [
        {
          name: "Dashboard",
          icon: <LayoutDashboard className="h-4 w-4" />,
          href: `/${wineCriticSlug}`,
        },
        {
          name: "Tastings",
          icon: <BookOpenCheck className="h-4 w-4" />,
          href: `/${wineCriticSlug}/tastings`,
          subItems: tastings.map((tasting) => ({
            label: tasting.name,            
            href: `/${wineCriticSlug}/tastings/${tasting.slug}`,
          })),
        },        
        {
          name: "Wineries",
          icon: <Building2 className="h-4 w-4" />,
          href: `/${wineCriticSlug}/winerys`,
        },
      ],
    },
    {
      name: "Configuración",
      items: [
        {
          name: "Usuarios",
          icon: <Users className="h-4 w-4" />,
          href: `/${wineCriticSlug}/users`,
        },
      ],
    },
  ]
}
