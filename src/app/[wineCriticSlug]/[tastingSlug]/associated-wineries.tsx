'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { addWineryToTastingAction, removeWineryFromTastingAction, addAllWineriesToTastingAction, removeAllWineriesFromTastingAction } from "@/app/[wineCriticSlug]/winerys/winery-actions"
import { TastingDAO } from '@/services/tasting-services'
import { WineryDAO } from '@/services/winery-services'
import { toast } from '@/hooks/use-toast'
import { Loader, Minus, MinusCircle, PlusCircle } from 'lucide-react'

type Props = {
    tasting: TastingDAO
    tastingWineries: WineryDAO[]
    allWineries: WineryDAO[]
}

export default function AssociatedWineries({ tasting, tastingWineries: initialTastingWineries, allWineries }: Props) {
    const [tastingWineries, setTastingWineries] = useState<WineryDAO[]>(initialTastingWineries)
    const [loading, setLoading] = useState(false)
    const [loadingId, setLoadingId] = useState<string | null>(null)

    const nonAssociatedWineries = allWineries.filter(
        winery => !tastingWineries.some(tw => tw.id === winery.id)
    )

    const handleAddWinery = async (wineryId: string) => {
        setLoading(true)
        setLoadingId(wineryId)
        await addWineryToTastingAction(tasting.id, wineryId)
        const addedWinery = allWineries.find(w => w.id === wineryId)
        if (addedWinery) {
            setTastingWineries([...tastingWineries, addedWinery])
        }
        toast({ title: "Bodega agregada" })
        setLoading(false)
        setLoadingId(null)
    }

    const handleRemoveWinery = async (wineryId: string) => {        
        setLoading(true)
        setLoadingId(wineryId)
        await removeWineryFromTastingAction(tasting.id, wineryId)
        setTastingWineries(tastingWineries.filter(w => w.id !== wineryId))
        toast({ title: "Bodega quitada" })
        setLoading(false)
        setLoadingId(null)
    }

    const handleAddAllWineries = async () => {
        setLoading(true)
        setLoadingId("addAllWineries")
        await addAllWineriesToTastingAction(tasting.id, nonAssociatedWineries.map(w => w.id))
        setTastingWineries(allWineries)
        toast({ title: "Se agregaron todas las bodegas" })
        setLoading(false)
        setLoadingId(null)
    }

    const handleRemoveAllWineries = async () => {
        setLoading(true)
        setLoadingId("removeAllWineries")
        await removeAllWineriesFromTastingAction(tasting.id)
        setTastingWineries([])
        toast({ title: "Se quitaron todas las bodegas" })
        setLoading(false)
        setLoadingId(null)
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
                            <div key={winery.id} className="flex justify-between items-center mb-2 pr-4">
                                <span>{winery.name}</span>
                                <Button variant="destructive" size="sm" className='w-20'
                                    onClick={() => handleRemoveWinery(winery.id)}>
                                    {loading && loadingId === winery.id ? <Loader className="w-4 h-4 animate-spin" /> : <MinusCircle className="w-4 h-4" />}
                                    <p>Quitar</p>
                                </Button>
                            </div>
                        ))}
                    </ScrollArea>
                    {tastingWineries.length > 0 && (
                        <Button className="mt-4 w-full" variant="destructive" 
                            onClick={handleRemoveAllWineries}>
                            {loading && loadingId === "removeAllWineries" ? <Loader className="w-4 h-4 animate-spin" /> : <MinusCircle className="w-4 h-4" />}
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
                                <Button variant="secondary" size="sm" className='w-20'
                                    onClick={() => handleAddWinery(winery.id)}>
                                    {loading && loadingId === winery.id ? <Loader className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
                                    Agregar
                                </Button>
                            </div>
                        ))}
                    </ScrollArea>
                    {nonAssociatedWineries.length > 0 && (
                        <Button className="mt-4 w-full" variant="default" 
                            onClick={handleAddAllWineries}>
                            {loading && loadingId === "addAllWineries" ? <Loader className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
                            Agregar todas las bodegas
                        </Button>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

