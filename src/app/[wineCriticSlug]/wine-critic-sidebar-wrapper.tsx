"use client"

import { SidebarComponent } from "@/components/layout/sidebar-component"
import { MenuGroup } from "@/lib/utils"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { getWinesDAOByWineryAndTastingSlugsAction } from "./wines/wine-actions"
import { Check, Wine } from "lucide-react"

type Props = {
    wineCriticMenu: MenuGroup[]
}

export function WineCriticSidebarWrapper({ wineCriticMenu }: Props) {
    const params = useParams()
    const { winerySlug, tastingSlug, wineCriticSlug } = params

    const [finalMenu, setFinalMenu] = useState<MenuGroup[]>(wineCriticMenu)

    useEffect(() => {
        const updateMenu = async () => {
            if (winerySlug && tastingSlug) {
                const wines = await getWinesMenu(wineCriticSlug as string, tastingSlug as string, winerySlug as string)
                const wineryName = unSlugify(winerySlug as string)
                
                // Filtrar el menú existente para remover el grupo de vinos de esta bodega si existe
                const baseMenu = wineCriticMenu.filter(group => group.name !== `${wineryName} wines`)
                
                // Agregar el grupo actualizado de vinos
                setFinalMenu([
                    ...baseMenu,
                    {
                        name: `${wineryName} wines`,
                        items: wines
                    }
                ])
            } else {
                setFinalMenu(wineCriticMenu)
            }
        }

        updateMenu()
    }, [winerySlug, tastingSlug, wineCriticSlug, wineCriticMenu])

    return <SidebarComponent menuGroups={finalMenu} />
}

async function getWinesMenu(wineCriticSlug: string, tastingSlug: string, winerySlug: string) {
    const wines = await getWinesDAOByWineryAndTastingSlugsAction(winerySlug, tastingSlug)
    return wines.map((wine) => ({
        name: wine.name,
        href: `/${wineCriticSlug}/${tastingSlug}/${winerySlug}/${wine.id}`,
        icon: <Wine className="h-4 w-4" />,
        opositeIcon: wine.review?.finished ? <Check className="h-4 w-4" /> : undefined
    }))
}

function unSlugify(slug: string) {
    return slug
        .replace(/-/g, " ")
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
}