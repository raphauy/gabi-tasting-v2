import { TastingsSummary } from "@/services/analytics"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Wine, Grape, Building2, ClipboardCheck } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

type Props = {
    tastingsSummary: TastingsSummary
}

export default function Dashboard({ tastingsSummary }: Props) {
    // Calcular el promedio global solo con los tastings que tienen puntuación
    const validScores = tastingsSummary.tastingsBreakdown
        .map(t => t.averageScore)
        .filter((score): score is number => score !== undefined);
    
    const globalAverageScore = validScores.length > 0
        ? Math.round(validScores.reduce((acc, score) => acc + score, 0) / validScores.length)
        : null;

    return (
        <div className="p-6 space-y-6">
            {/* Métricas Principales */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Tastings</CardTitle>
                        <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{tastingsSummary.totalTastings}</div>
                        <p className="text-xs text-muted-foreground">
                            {tastingsSummary.activeTastings} active
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Wineries</CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{tastingsSummary.totalWineries}</div>
                        <p className="text-xs text-muted-foreground">
                            Participating in tastings
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Wines</CardTitle>
                        <Wine className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{tastingsSummary.totalWines}</div>
                        <p className="text-xs text-muted-foreground">
                            Across all tastings
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                        <Grape className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {globalAverageScore ?? '-'}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Global average score
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Tabla de Tastings */}
            <Card>
                <CardHeader>
                    <CardTitle>Tastings Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead>Name</TableHead>
                                <TableHead className="text-center">Status</TableHead>
                                <TableHead className="text-center">Wineries</TableHead>
                                <TableHead className="text-center">Wines</TableHead>
                                <TableHead className="text-center">Average Score</TableHead>
                                <TableHead className="text-center">Progress</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tastingsSummary.tastingsBreakdown.map((tasting) => {
                                const progressPercentage = Math.round(
                                    (tasting.completedReviewsCount / 
                                    (tasting.completedReviewsCount + tasting.pendingReviewsCount)) * 100
                                );

                                return (
                                    <TableRow key={tasting.id} className="hover:bg-muted/50">
                                        <TableCell className="font-medium text-left">
                                            <Link href={`/${tastingsSummary.wineCriticSlug}/${tasting.slug}`} className="hover:underline">
                                                {tasting.name}
                                            </Link>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant={progressPercentage === 100 ? "default" : "secondary"}>
                                                {progressPercentage === 100 ? "Completed" : "In Progress"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center">{tasting.wineriesCount}</TableCell>
                                        <TableCell className="text-center">{tasting.winesCount}</TableCell>
                                        <TableCell className="text-center">
                                            {tasting.averageScore ? (
                                                <Badge variant={
                                                    tasting.averageScore >= 90 ? "default" :
                                                    tasting.averageScore >= 85 ? "secondary" :
                                                    "outline"
                                                }>
                                                    {tasting.averageScore}
                                                </Badge>
                                            ) : (
                                                <span className="text-muted-foreground">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-2">
                                                <Progress 
                                                    value={progressPercentage} 
                                                    className={cn(
                                                        "h-2",
                                                        "relative overflow-hidden rounded-full bg-slate-300 dark:bg-slate-700",
                                                        "[&>div]:bg-[#ff915e]"
                                                    )}
                                                />
                                                <p className="text-xs text-muted-foreground">
                                                    {tasting.completedReviewsCount} of {tasting.completedReviewsCount + tasting.pendingReviewsCount} reviews
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}