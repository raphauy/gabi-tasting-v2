'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { addWineryToTastingAction, removeWineryFromTastingAction, addAllWineriesToTasting, removeAllWineriesFromTasting } from "@/app/[wineCriticSlug]/winerys/winery-actions"
import { TastingDAO } from '@/services/tasting-services'
import { WineryDAO } from '@/services/winery-services'
import { toast } from '@/hooks/use-toast'

type Props = {
    tasting: TastingDAO
    tastingWineries: WineryDAO[]
    allWineries: WineryDAO[]
}

export default function AssociatedWineries({ tasting, tastingWineries: initialTastingWineries, allWineries }: Props) {
    const [tastingWineries, setTastingWineries] = useState<WineryDAO[]>(initialTastingWineries)

    const nonAssociatedWineries = allWineries.filter(
        winery => !tastingWineries.some(tw => tw.id === winery.id)
    )

    const handleAddWinery = async (wineryId: string) => {
        await addWineryToTastingAction(tasting.id, wineryId)
        const addedWinery = allWineries.find(w => w.id === wineryId)
        if (addedWinery) {
            setTastingWineries([...tastingWineries, addedWinery])
        }
        toast({ title: "Bodega agregada" })
    }

    const handleRemoveWinery = async (wineryId: string) => {
        await removeWineryFromTastingAction(tasting.id, wineryId)
        setTastingWineries(tastingWineries.filter(w => w.id !== wineryId))
        toast({ title: "Bodega quitada" })
    }

    const handleAddAllWineries = async () => {
        await addAllWineriesToTasting(tasting.id, nonAssociatedWineries.map(w => w.id))
        setTastingWineries(allWineries)
        toast({ title: "Se agregaron todas las bodegas" })
    }

    const handleRemoveAllWineries = async () => {
        await removeAllWineriesFromTasting(tasting.id)
        setTastingWineries([])
        toast({ title: "Se quitaron todas las bodegas" })
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
                <CardHeader>
                    <CardTitle>Bodegas asociadas a {tasting.name}</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[300px]">
                        {tastingWineries.map(winery => (
                            <div key={winery.id} className="flex justify-between items-center mb-2">
                                <span>{winery.name}</span>
                                <Button variant="destructive" size="sm" onClick={() => handleRemoveWinery(winery.id)}>
                                    Quitar
                                </Button>
                            </div>
                        ))}
                    </ScrollArea>
                    {tastingWineries.length > 0 && (
                        <Button className="mt-4 w-full" variant="destructive" onClick={handleRemoveAllWineries}>
                            Quitar todas las bodegas
                        </Button>
                    )}
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Bodegas disponibles</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[300px]">
                        {nonAssociatedWineries.map(winery => (
                            <div key={winery.id} className="flex justify-between items-center mb-2">
                                <span>{winery.name}</span>
                                <Button variant="secondary" size="sm" onClick={() => handleAddWinery(winery.id)}>
                                    Agregar
                                </Button>
                            </div>
                        ))}
                    </ScrollArea>
                    {nonAssociatedWineries.length > 0 && (
                        <Button className="mt-4 w-full" variant="default" onClick={handleAddAllWineries}>
                            Agregar todas las bodegas
                        </Button>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

