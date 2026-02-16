"use client"

import { WineDialog } from "@/app/[wineCriticSlug]/wines/wine-dialogs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { WineDAO } from "@/services/wine-services"
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { Calendar, Check, Clock, DollarSign, Droplet, FileText, GrapeIcon, MapPin } from "lucide-react"
import Link from "next/link"

type Props = {
  wine: WineDAO
  tastingId?: string
  href?: string
}

export function WineCard({ wine, tastingId, href }: Props) {
  const handleTechnicalFileClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    window.open(wine.technicalFileUrl, '_blank', 'noopener,noreferrer')
  }

  const CardElement = (
    <Card className="hover:shadow-lg transition-shadow duration-200 w-full h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <p>{wine.name}</p>
            {wine.review?.finished && <Check className="h-5 w-5 font-bold text-green-500" />}
          </CardTitle>
          <div className="flex items-center gap-2 text-muted-foreground">
            {tastingId && <WineDialog wineryId={wine.wineryId} id={wine.id} tastingId={tastingId} />}
            <div><MapPin className="h-3.5 w-3.5" /></div>
            <span className="text-xs">{wine.region}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            <span>Añada: {wine.vintage}</span>
          </div>
          <div className="flex items-center gap-1">
            <GrapeIcon className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{wine.grapes}</span>
          </div>
          <div className="flex items-center gap-1">
            <Droplet className="h-3.5 w-3.5 shrink-0" />
            <span>{wine.abv}% Alc.</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="h-3.5 w-3.5 shrink-0" />
            <span>{wine.price?.toLocaleString() ?? 'N/A'}</span>
          </div>
          {wine.technicalFileUrl && (
            <div className="flex items-center gap-1">
              <FileText className="h-3.5 w-3.5 shrink-0" />
              <div onClick={handleTechnicalFileClick} className="text-primary hover:underline cursor-pointer">
                Ficha técnica
              </div>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 shrink-0" />
            <span className="text-xs" suppressHydrationWarning>
              Actualizado {formatDistanceToNow(new Date(wine.updatedAt), { addSuffix: true, locale: es })}
            </span>
          </div>
        </div>
        <div className="flex justify-end mt-1">
          <Badge variant="secondary">
            {wine.style}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )

  return href ? (
    <Link href={href} className="block w-full h-full">
      {CardElement}
    </Link>
  ) : CardElement
} 