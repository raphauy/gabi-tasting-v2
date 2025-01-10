"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { KanbanTastingDayDAO, KanbanTastingDayDAOWithWineries } from "@/services/tastingday-services";
import { TastingDayWineryDAO } from "@/services/tastingdaywinery-services";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { CircleCheckIcon, CircleDashedIcon, CircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import TastingDayMenu from "./tasting-day-menu";
import { format } from "date-fns";
import WineryCard from "./winery-card";

type Props = {
    tastingDay: KanbanTastingDayDAOWithWineries
    index: number
}
export default function TastingDayColumn({ tastingDay, index }: Props) {
  const [wineries, setWineries] = useState<TastingDayWineryDAO[]>([])

  useEffect(() => {
    setWineries(tastingDay.wineries)
  }, [tastingDay.wineries])

  const label = tastingDay.date ? format(tastingDay.date, "dd/MM/yyyy") : "Sin fecha"

  return (
    <div>
      <Draggable draggableId={tastingDay.id} index={index}>
        {(provided) => (
          <li className="shrink-0 h-full w-80 select-none" ref={provided.innerRef} {...provided.draggableProps}>
            <Card className="bg-muted h-full group" {...provided.dragHandleProps}>
              <CardHeader className="pb-2 px-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-1 text-lg font-medium" >{getSatusIcon(tastingDay)} {label} &nbsp; {wineries.length}</CardTitle>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <TastingDayMenu tastingId={tastingDay.tastingId} tastingDayId={tastingDay.id} tastingDayDateStr={label} />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="h-full px-2">
                <Droppable droppableId={tastingDay.id} type="winery">
                  {(provided) => (
                    <ol className="space-y-3 h-full" ref={provided.innerRef} {...provided.droppableProps}>
                      {wineries.map((winery, index) => (
                        <WineryCard key={winery.wineryId} winery={winery.winery} index={index} />
                      ))}
                      {provided.placeholder}
                    </ol>
                  )}
                </Droppable>
              </CardContent>
            </Card>
          </li>
        )}
      </Draggable>
    </div>
  )
    
}

function getSatusIcon(tastingDay: KanbanTastingDayDAOWithWineries) {
  if (tastingDay.isDefault) return <CircleDashedIcon size={16} className={cn("mb-0.5")} />

  return <CircleIcon size={16} className={cn("mb-0.5")} />
}
