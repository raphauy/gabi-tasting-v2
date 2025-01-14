"use client"

import { getWineryNameBySlugAction } from "@/app/[wineCriticSlug]/winerys/winery-actions"
import { cn } from "@/lib/utils"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

export function HeaderLabel() {
  const params = useParams()
  const winerySlug = params.winerySlug as string
  
  const [winery, setWinery] = useState("")

  useEffect(() => {
    if (!winerySlug) {
      setWinery("")
      return
    }
    getWineryNameBySlugAction(winerySlug)
    .then(name => setWinery(name))
    .catch(error => console.error('Error fetching winery name:', error))
    
  }, [winerySlug])

  return (
    <div className={cn("flex items-center gap-2 font-medium")}>
      {winery && (
        <div className="flex items-center gap-2">
          {getSVGSlash()}
          <p>{winery}</p>
        </div>
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