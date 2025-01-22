"use client"

import { Input } from "@/components/ui/input"
import { WineAndReviewsDAO, WineDAO } from "@/services/wine-services"
import { Search } from "lucide-react"
import { useState } from "react"
import { WineCard } from "../../../../components/wine-card"

type Props = {
    wines: WineAndReviewsDAO[] | WineDAO[]
    basePath: string
}

export function WineList({ wines, basePath }: Props) {
    const [searchTerm, setSearchTerm] = useState("")
    
    const filteredWines = wines.filter(wine => 
        wine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        wine.abv?.toString().includes(searchTerm) ||
        wine.grapes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        wine.price?.toString().includes(searchTerm) ||
        wine.region?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        wine.style?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        wine.vintage?.toString().includes(searchTerm)
    )

    return (
        <div className="w-full max-w-5xl mx-auto py-6 space-y-6">
            <div className="w-full max-w-md mx-auto px-4 relative">
                <Search className="absolute left-7 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Buscar vinos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10"
                />
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 place-items-center">
                {filteredWines.map((wine) => (
                    <WineCard 
                        key={wine.id} 
                        wine={wine} 
                        href={`${basePath}/${wine.id}`} 
                    />
                ))}
            </div>
        </div>
    )
}