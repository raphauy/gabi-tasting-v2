import { Button } from "@/components/ui/button"
import { getFirstTastingSlug, getWineryDAOBySlug } from "@/services/winery-services"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"

type Props = {
  params: Promise<{
    winerySlug: string
  }>
}

export default async function WineryPage({ params }: Props) {
  const { winerySlug } = await params
  console.log(winerySlug)
  const winery= await getWineryDAOBySlug(winerySlug)
  if (!winery) {
    return notFound()
  }
  const firstTasting= await getFirstTastingSlug(winery.id)

  if (firstTasting) {
    redirect(`/winery/${winerySlug}/${firstTasting}`)
  } else {
    return <div>Esta bodega no tiene ningún tasting asociado</div>
  }

  return (
    <div className="w-full text-center">      
      <p className="text-2xl font-bold">Dashboard de {winery.name}</p>
      <p className="text-sm text-muted-foreground">En desarrollo</p>
    </div>
  )
}
