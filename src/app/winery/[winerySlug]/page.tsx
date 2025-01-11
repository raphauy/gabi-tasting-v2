import { getWineryDAOBySlug } from "@/services/winery-services"
import { notFound } from "next/navigation"

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
  return (
    <div className="w-full text-center">      
      <p className="text-2xl font-bold">Dashboard de {winery.name}</p>
      <p className="text-sm text-muted-foreground">En desarrollo</p>
    </div>
  )
}
