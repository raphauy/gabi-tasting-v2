import { MenuGroup } from "@/lib/utils"
import { Users, Settings, LayoutDashboard, FileText, Building2, Glasses, BookOpenCheck } from "lucide-react"

export const adminMenu: MenuGroup[] = [
  {
    name: "Administración",
    items: [
      {
        name: "Dashboard",
        icon: <LayoutDashboard className="h-4 w-4" />,
        href: "/admin",
      },
      {
        name: "Users",
        icon: <Users className="h-4 w-4" />,
        href: "/admin/users",
        subItems:[
          {
            label: "Sessions",
            href: "/admin/otpsessions"
          }
        ]
      },
      {
        name: "Wine Critics",
        icon: <Glasses className="h-4 w-4" />,
        href: "/admin/winecritics",
      },
    ],
  },
  {
    name: "Tastings",
    items: [
      {
        name: "Gabi Tasting",
        icon: <BookOpenCheck className="h-4 w-4" />,
        href: "/gabi-zimmer/tastings",
      },
    ],
  },
  {
    name: "Configuración",
    items: [
      {
        name: "Configuración",
        icon: <Settings className="h-4 w-4" />,
        href: "/admin/settings",
      },
    ],
  },
]

