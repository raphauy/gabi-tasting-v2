import { prisma } from "@/lib/db";
import { Tasting, WineryTasting, WineTasting, Review } from "@prisma/client";

export type TastingsSummary = {
    wineCriticSlug: string;
    totalTastings: number;
    activeTastings: number;
    totalWineries: number;
    totalWines: number;
    tastingsBreakdown: {
        id: string;
        name: string;
        slug: string;
        wineriesCount: number;
        winesCount: number;
        completedReviewsCount: number;
        pendingReviewsCount: number;
        averageScore?: number;
        wineries: {
            name: string;
            winesCount: number;
        }[];
    }[];
}

type TastingWithRelations = Tasting & {
    wineries: (WineryTasting & {
        winery: { 
            id: string;
            name: string;
        };
        wineryId: string;
    })[];
    wines: (WineTasting & {
        wine: {
            id: string;
            wineryId: string;
            review: Review | null;
        }
    })[];
}

export async function getTastingsSummary(wineCriticSlug: string): Promise<TastingsSummary> {
    // Obtener todos los tastings con sus relaciones
    const tastings = await prisma.tasting.findMany({
        where: {
            wineCritic: {
                slug: wineCriticSlug
            }
        },
        include: {
            wineries: {
                include: {
                    winery: true,
                },
            },
            wines: {
                include: {
                    wine: {
                        include: {
                            review: true,
                        }
                    }
                }
            }
        }
    }) as TastingWithRelations[];

    // Calcular métricas generales
    const totalTastings = tastings.length;
    const totalWineries = new Set(tastings.flatMap((t: TastingWithRelations) => t.wineries.map(w => w.winery.id))).size;
    const totalWines = new Set(tastings.flatMap((t: TastingWithRelations) => t.wines.map(w => w.wine.id))).size;

    // Calcular desglose por tasting
    const tastingsBreakdown = tastings.map((tasting: TastingWithRelations) => {
        const wineriesCount = tasting.wineries.length;
        const wines = tasting.wines;
        const winesCount = wines.length;
        
        const reviews = wines.map(w => w.wine.review).filter((r): r is Review => r !== null);
        const completedReviewsCount = reviews.filter(r => r.finished).length;
        const pendingReviewsCount = winesCount - completedReviewsCount;
        
        const scores = reviews
            .filter((r): r is Review & { score: number } => r.score !== null)
            .map(r => r.score);
        
        const averageScore = scores.length > 0
            ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
            : undefined;

        // Agrupar vinos por bodega
        const wineriesWithWines = tasting.wineries.map(w => ({
            name: w.winery.name,
            winesCount: tasting.wines.filter(wine => wine.wine.wineryId === w.wineryId).length
        }));

        // sort wineriesWithWines by winesCount
        wineriesWithWines.sort((a, b) => b.winesCount - a.winesCount);

        return {
            id: tasting.id,
            name: tasting.name,
            slug: tasting.slug,
            wineriesCount,
            winesCount,
            completedReviewsCount,
            pendingReviewsCount,
            averageScore,
            wineries: wineriesWithWines
        };
    });

    return {
        wineCriticSlug,
        totalTastings,
        activeTastings: totalTastings, // Por ahora igual a totalTastings, podemos agregar lógica de activos después
        totalWineries,
        totalWines,
        tastingsBreakdown,
    };
}