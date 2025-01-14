"use client"

import { getTastingNameBySlugAction } from "@/app/[wineCriticSlug]/tastings/tasting-actions"
import { getWineryNameBySlugAction } from "@/app/[wineCriticSlug]/winerys/winery-actions"
import { getWineCriticNameBySlugAction } from "@/app/admin/winecritics/winecritic-actions"
import { cn } from "@/lib/utils"
import { useParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"

export function HeaderLabel() {
  const params = useParams()
  
  const [names, setNames] = useState({
    winery: "",
    tasting: "",
    wineCritic: ""
  })

  // Memoizamos los slugs para evitar recálculos innecesarios
  const slugs = useMemo(() => ({
    winerySlug: params.winerySlug as string | undefined,
    tastingSlug: params.tastingSlug as string | undefined,
    wineCriticSlug: params.wineCriticSlug as string | undefined
  }), [params])

  useEffect(() => {
    let isMounted = true

    const fetchNames = async () => {
      try {
        const newNames = { winery: "", tasting: "", wineCritic: "" }

        if (slugs.winerySlug) {
          newNames.winery = await getWineryNameBySlugAction(slugs.winerySlug)
        }
        if (slugs.tastingSlug) {
          newNames.tasting = await getTastingNameBySlugAction(slugs.tastingSlug)
        }
        if (slugs.wineCriticSlug) {
          newNames.wineCritic = await getWineCriticNameBySlugAction(slugs.wineCriticSlug)
        }

        if (isMounted) {
          setNames(newNames)
        }
      } catch (error) {
        console.error('Error fetching names:', error)
      }
    }

    fetchNames()

    return () => {
      isMounted = false
    }
  }, [slugs])

  const renderSlashAndText = (text: string) => {
    if (!text) return null
    return (
      <>
        <div>
          {getSVGSlash()}
        </div>
        <p>
          {text}
        </p>
      </>
    )
  }

  return (
    <div className={cn("flex items-center gap-2 font-medium")}>
      {renderSlashAndText(names.wineCritic)}
      <div className="hidden md:flex items-center">{renderSlashAndText(names.tasting)}</div>
      {renderSlashAndText(names.winery)}

      {!names.tasting && !names.winery && !names.wineCritic && (
        <>
          <div>{getSVGSlash()}</div>
          <p>Admin</p>
        </>
      )}
    </div>
  )
}

function getSVGSlash() {
  return (
    <svg
      width="24"
      height="40"
      viewBox="0 0 24 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-gray-500 h-10"
    >
      <path
        d="M14 4L10 28"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  )
}