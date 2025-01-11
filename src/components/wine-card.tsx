'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { WineDAO } from "@/services/wine-services"
import { Wine, MapPin, Calendar, Droplet, DollarSign, Clock, GrapeIcon } from "lucide-react"
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import Link from "next/link"

type Props = {
  wine: WineDAO
}

export function WineCard({ wine }: Props) {
  return (
    <Link 
      href={`/winery/${wine.winery.slug}/${wine.tastings[0].slug}/${wine.id}`}
      className="block w-full max-w-xl hover:no-underline"
    >
      <Card className="hover:shadow-lg transition-shadow duration-200 w-full">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">
              {wine.name}
            </CardTitle>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{wine.region}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Añada: {wine.vintage}</span>
          </div>

          <div className="flex items-center gap-2">
            <Droplet className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{wine.abv}% Alc.</span>
          </div>

          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{wine.price?.toLocaleString() ?? 'N/A'}</span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="text-xs">
                Actualizado {formatDistanceToNow(new Date(wine.updatedAt), { addSuffix: true, locale: es })}
              </span>
            </div>
            <Badge variant="secondary" className="ml-auto">
              {wine.style}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
} 