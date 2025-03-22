import { TastingDAO } from "@/services/tasting-services"
import { getFullWinerysDAOByTastingId } from "@/services/winery-services"
import { format } from "date-fns"
import { es } from "date-fns/locale"

// Componentes UI de Shadcn
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import ExportButton from "./export-button"

type Props = {
    tasting: TastingDAO
}

export default async function ReportWrapper({ tasting }: Props) {
    const wineries = await getFullWinerysDAOByTastingId(tasting.id)
    
    // Función para formatear fechas
    const formatDate = (date: Date) => {
        return format(date, "d 'de' MMMM, yyyy", { locale: es })
    }
    
    // Función para obtener el color del badge según el puntaje
    const getScoreColor = (score: number | undefined) => {
        if (!score) return "secondary"
        if (score >= 95) return "over95" 
        if (score >= 90) return "over90"
        return "under90"
    }
    
    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex flex-col items-center mb-8">
                <div className="w-full flex justify-between items-center mb-4">
                    <h1 className="text-3xl font-bold">{tasting.name}</h1>
                    <ExportButton tastingId={tasting.id} />
                </div>                
            </div>
            
            <div className="space-y-8 max-w-5xl mx-auto">
                {wineries.map((winery) => (
                    <Card key={winery.id} className="mb-8 overflow-hidden">
                        <CardHeader className="bg-muted/50">
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle className="text-2xl">{winery.name}</CardTitle>
                                    {winery.description && (
                                        <CardDescription className="mt-1">{winery.description}</CardDescription>
                                    )}
                                </div>
                                <Badge variant="outline" className="text-sm font-medium">
                                    {winery.wines.length} {winery.wines.length === 1 ? 'vino' : 'vinos'}
                                </Badge>
                            </div>
                        </CardHeader>
                        
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {winery.wines.map((wine) => (
                                    <Card key={wine.id} className="shadow-sm flex flex-col h-full">
                                        <CardHeader className="pb-3">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <CardTitle className="text-lg font-semibold">
                                                        {wine.name} ({wine.vintage})
                                                    </CardTitle>
                                                    <div className="flex flex-wrap gap-x-4 mt-1 text-sm text-muted-foreground">
                                                        {wine.region && (
                                                            <div className="flex items-center">
                                                                <span className="font-medium">Región:</span>
                                                                <span className="ml-1">{wine.region}</span>
                                                            </div>
                                                        )}
                                                        {wine.abv && (
                                                            <div className="flex items-center">
                                                                <span className="font-medium">ABV:</span>
                                                                <span className="ml-1">{wine.abv}%</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                {wine.review?.score && (
                                                    <Badge variant={getScoreColor(wine.review.score)} className="whitespace-nowrap">
                                                        {wine.review.score}
                                                    </Badge>
                                                )}
                                            </div>
                                        </CardHeader>
                                        
                                        <CardContent className="pt-0 flex-grow">
                                            {wine.review?.tastingNote && (
                                                <div 
                                                    className="mt-2 italic text-muted-foreground prose prose-sm max-w-none"
                                                    dangerouslySetInnerHTML={{ __html: wine.review.tastingNote }}
                                                />
                                            )}
                                        </CardContent>
                                        
                                        <CardFooter className="text-xs text-muted-foreground pt-2 border-t mt-auto">
                                            {wine.review?.createdAt && (
                                                <span>Catado el {formatDate(wine.review.createdAt)}</span>
                                            )}
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}