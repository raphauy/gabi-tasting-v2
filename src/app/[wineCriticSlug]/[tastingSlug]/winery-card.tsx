'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { WineryDAO } from "@/services/winery-services";
import { Draggable } from "@hello-pangea/dnd";
import { WineryDialog } from "@/app/[wineCriticSlug]/winerys/winery-dialogs";
import { WineDAO } from "@/services/wine-services";
import DropdownWines from "./dropdown-wines";
import Link from "next/link";
import { Expand } from "lucide-react";

type Props = {
  winery: WineryDAO
  wines: WineDAO[]
  wineCriticSlug: string
  tastingSlug: string
  index: number
}
export default function WineryCard({ winery, wines, wineCriticSlug, tastingSlug, index }: Props) {

  return (
    <>
        <Draggable draggableId={winery.id} index={index}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                <Card>
                  <CardContent className="p-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={winery.image || undefined} alt={winery.name} className="object-cover"/>
                          <AvatarFallback>{winery.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <Link href={`/${wineCriticSlug}/${tastingSlug}/${winery.slug}`} className="font-medium text-sm">{winery.name}</Link>
                          <p className="text-sm text-gray-500">{winery.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link href={`/${wineCriticSlug}/${tastingSlug}/${winery.slug}`}>
                          <Expand className="h-4 w-4 text-muted-foreground" />
                        </Link>
                        <WineryDialog id={winery.id} wineCriticId={winery.wineCriticId} />
                      </div>
                    </div>
                    { 
                      wines.length > 0 && 
                      <DropdownWines wines={wines} />
                    }
                    </CardContent>
                </Card>
              </div>
            )}
        </Draggable>
      </>
    )
    
}