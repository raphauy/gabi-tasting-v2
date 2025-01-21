import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { WineAndReviewsDAO } from "@/services/wine-services"
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { Calendar, Clock, DollarSign, Droplet, FileText, GrapeIcon, MapPin } from "lucide-react"
import Link from "next/link"

type Props = {
  wine: WineAndReviewsDAO
}

export function ReviewWineCard({ wine }: Props) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 w-full h-full flex flex-col">
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
      <CardContent className="flex flex-col flex-1">
        <div className="space-y-3 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-4 mb-auto relative">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Añada: {wine.vintage}</span>
          </div>

          <div className="flex items-center gap-2">
            <GrapeIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{wine.grapes}</span>
          </div>

          <div className="flex items-center gap-2">
            <Droplet className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{wine.abv}% Alc.</span>
          </div>

          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{wine.price?.toLocaleString() ?? 'N/A'}</span>
          </div>

          {wine.technicalFileUrl && (
            <div className="flex items-center gap-2 lg:relative lg:z-10">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <Link 
                href={wine.technicalFileUrl} 
                target="_blank" 
                className="text-sm text-primary hover:underline"
              >
                Ficha técnica
              </Link>
            </div>
          )}

          <div className="hidden lg:flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span className="text-xs">
              Actualizado {formatDistanceToNow(new Date(wine.updatedAt), { addSuffix: true, locale: es })}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center mt-3 lg:mt-0 lg:-translate-y-6 relative lg:z-0">
          <div className="flex lg:hidden items-center gap-2 text-muted-foreground">
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
)
} 