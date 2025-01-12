import { columns } from "@/app/[wineCriticSlug]/wines/wine-columns"
import { DataTable } from "@/app/[wineCriticSlug]/wines/wine-table"
import { Button } from "@/components/ui/button"
import { WineCard } from "@/components/wine-card"
import { getTastingDAOBySlug, TastingDAO } from "@/services/tasting-services"
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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 place-items-center">
        {wines.map((wine) => (
          <WineCard key={wine.id} wine={wine} />
        ))}
      </div>
    </div>
  )
}

function getEmptyWinesComponent(tastingName: string, winerySlug: string, tastingSlug: string) {
  return (
    <div className="w-full max-w-5xl mx-auto py-12">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center bg-muted">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Aún no tienes vinos inscriptos en {tastingName}
        </h3>
        <p className="text-gray-500 mb-6">
          Comienza agregando tu primer vino a esta degustación
        </p>
        <Link href={`/winery/${winerySlug}/${tastingSlug}/new`}>
          <Button size="lg">
            <PlusCircle size={22} className="mr-2"/>
            Agregar mi primer vino
          </Button>
        </Link>
      </div>
    </div>
  )
}
