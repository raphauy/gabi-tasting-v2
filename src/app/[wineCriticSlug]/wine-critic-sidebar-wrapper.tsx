"use client"

import { SidebarComponent } from "@/components/layout/sidebar-component"
import { MenuGroup } from "@/lib/utils"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { getWinesDAOByWineryAndTastingSlugsAction } from "./wines/wine-actions"
import { Wine } from "lucide-react"

type Props = {
    wineCriticMenu: MenuGroup[]
}

export function WineCriticSidebarWrapper({ wineCriticMenu }: Props) {

    const params = useParams()
    const { winerySlug, tastingSlug, wineCriticSlug } = params

    const [finalMenu, setFinalMenu] = useState<MenuGroup[]>(wineCriticMenu)

    useEffect(() => {
        console.log("winerySlug: ", winerySlug)
        console.log("tastingSlug: ", tastingSlug)
        console.log("wineCriticSlug: ", wineCriticSlug)
        if (winerySlug && tastingSlug) {
            console.log("getting wines menu")
            getWinesMenu(wineCriticSlug as string, tastingSlug as string, winerySlug as string)
                .then(wines => {
                    setFinalMenu(prevMenu => [...prevMenu, {
                        name: unSlugify(winerySlug as string) + " wines",
                        items: wines
                    }])
                })
        } else {
            setFinalMenu(wineCriticMenu)
        }
    }, [winerySlug, tastingSlug, wineCriticSlug, wineCriticMenu])

    return <SidebarComponent menuGroups={finalMenu} />
}

async function getWinesMenu(wineCriticSlug: string, tastingSlug: string, winerySlug: string) {
    const wines = await getWinesDAOByWineryAndTastingSlugsAction(winerySlug, tastingSlug)
    return wines.map((wine) => ({
        name: wine.name,
        href: `/${wineCriticSlug}/${tastingSlug}/${winerySlug}/${wine.id}`,
        icon: <Wine className="h-4 w-4" />,
    }))
}

function unSlugify(slug: string) {
    return slug
        .replace(/-/g, " ")
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
}