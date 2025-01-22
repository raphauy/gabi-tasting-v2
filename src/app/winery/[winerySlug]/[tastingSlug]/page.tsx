import { WineList } from "@/app/[wineCriticSlug]/[tastingSlug]/[winerySlug]/wine-list"
import { Button } from "@/components/ui/button"
import { getTastingDAOBySlug } from "@/services/tasting-services"
import { getWinesDAOByWineryAndTasting } from "@/services/wine-services"
import { getWineryDAOBySlug } from "@/services/winery-services"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

type Props = {
    params: Promise<{
        tastingSlug: string
        winerySlug: string
    }>
}

export default async function Page({ params }: Props) {
  const { tastingSlug, winerySlug } = await params
  const tasting = await getTastingDAOBySlug(tastingSlug)
  if (!tasting) {
    return <div>No se encontró el tasting {tastingSlug}</div>
  }
  const winery = await getWineryDAOBySlug(winerySlug)
  if (!winery) {
    return <div>No se encontró la bodega {winerySlug}</div>
  }
  const wines= await getWinesDAOByWineryAndTasting(winery.id, tasting.id)

  if (wines.length === 0) {
    return getEmptyWinesComponent(tasting.name, winerySlug, tastingSlug)
  }

  return (
    <div className="w-full max-w-5xl mx-auto py-6 ">      
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <p className="text-2xl font-bold mb-2 md:mb-0">Vinos inscriptos a {tasting.name}</p>
        <Link href={`/winery/${winerySlug}/${tastingSlug}/new`}>
          <Button>
            <PlusCircle size={22} className="mr-2"/>
            Agregar Vino
          </Button>
        </Link>
      </div>

      <WineList wines={wines} basePath={`/winery/${winerySlug}/${tastingSlug}`} />

      {/* <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 place-items-center">
        {wines.map((wine) => (
          <WineCard key={wine.id} wine={wine} />
        ))}
      </div> */}
    </div>
  )
}

function getEmptyWinesComponent(tastingName: string, winerySlug: string, tastingSlug: string) {
  return (
    <div className="w-full max-w-5xl mx-auto py-12">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center bg-muted">
        <div className="mb-6">
          <svg 
            width="120" 
            height="120" 
            viewBox="0 0 120 120" 
            className="mx-auto text-gray-400"
          >
            {/* Cuello de la botella */}
            <path 
              d="M55 15H65V40C65 40 75 45 75 55C75 65 75 100 75 100H45C45 100 45 65 45 55C45 45 55 40 55 40V15Z" 
              stroke="currentColor" 
              fill="none"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Boca de la botella */}
            <path 
              d="M52 15H68" 
              stroke="currentColor" 
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Aún no tienes vinos inscriptos en {tastingName}
        </h3>
        <p className="text-gray-500 mb-6">
          Comienza agregando tu primer vino a este tasting
        </p>
        <Link href={`/winery/${winerySlug}/${tastingSlug}/new`}>
          <Button size="lg">
            <PlusCircle size={22} className="mr-2"/>
            Agregar primer vino
          </Button>
        </Link>
      </div>
    </div>
  )
}
