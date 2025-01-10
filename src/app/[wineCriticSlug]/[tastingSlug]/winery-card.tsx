'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { WineryDAO } from "@/services/winery-services";
import { Draggable } from "@hello-pangea/dnd";
import { WineryDialog } from "@/app/[wineCriticSlug]/winerys/winery-dialogs";

type Props = {
  winery: WineryDAO
  index: number
}
export default function WineryCard({ winery, index }: Props) {

  return (
    <>
        <Draggable draggableId={winery.id} index={index}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                <Card>
                  <CardContent className="p-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={winery.image || undefined} alt={winery.name} className="object-cover"/>
                          <AvatarFallback>{winery.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{winery.name}</h3>
                          <p className="text-sm text-gray-500">{winery.description}</p>
                        </div>
                      </div>
                      <WineryDialog id={winery.id} wineCriticId={winery.wineCriticId} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
        </Draggable>
      </>
    )
    
}