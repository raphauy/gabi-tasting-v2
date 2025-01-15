import { getTastingNameBySlugAction } from "@/app/[wineCriticSlug]/tastings/tasting-actions"
import { getWineryNameBySlugAction } from "@/app/[wineCriticSlug]/winerys/winery-actions"
import { useParams } from "next/navigation"
import { useState, useCallback, useMemo, useEffect } from "react"

export function useWineryName() {
  const params = useParams()
  const winerySlug = useMemo(() => params?.winerySlug as string | undefined, [params])
  const [wineryName, setWineryName] = useState<string>("")

  const fetchWineryName = useCallback(async (slug: string) => {
    try {
      const name = await getWineryNameBySlugAction(slug)
      setWineryName(name)
    } catch (error) {
      console.error('Error fetching winery name:', error)
      setWineryName("")
    }
  }, [])

  useEffect(() => {
    if (!winerySlug) {
      setWineryName("")
      return
    }

    fetchWineryName(winerySlug)
  }, [winerySlug, fetchWineryName])

  return wineryName
} 

export function useTastingName() {
    const params = useParams()
    const tastingSlug = useMemo(() => params?.tastingSlug as string | undefined, [params])
    const [tastingName, setTastingName] = useState<string>("")
  
    const fetchTastingName = useCallback(async (slug: string) => {
      try {
        const name = await getTastingNameBySlugAction(slug)
        setTastingName(name)
      } catch (error) {
        console.error('Error fetching tasting name:', error)
        setTastingName("")
      }
    }, [])
    
    useEffect(() => {
      if (!tastingSlug) {
        setTastingName("")
        return
      }
  
      fetchTastingName(tastingSlug)
    }, [tastingSlug, fetchTastingName])
  
    return tastingName
}