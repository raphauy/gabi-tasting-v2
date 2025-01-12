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
import { DeleteTastingDayDialog, TastingDayDialog } from "./tastingdays/tastingday-dialogs";
import { WineDAO } from "@/services/wine-services";

type Props = {
    tastingDay: KanbanTastingDayDAOWithWineries
    index: number
    wines: WineDAO[]
}
export default function TastingDayColumn({ tastingDay, index, wines }: Props) {
  const [wineries, setWineries] = useState<TastingDayWineryDAO[]>([])

  useEffect(() => {
    setWineries(tastingDay.wineries)
  }, [tastingDay.wineries])

  const label = tastingDay.date ? format(tastingDay.date, "dd/MM/yyyy") : "Sin asignar"

  return (
    <div>
      <Draggable draggableId={tastingDay.id} index={index}>
        {(provided) => (
          <li className="shrink-0 h-full w-80 select-none" ref={provided.innerRef} {...provided.draggableProps}>
            <Card className="bg-muted h-full group" {...provided.dragHandleProps}>
              <CardHeader className="pb-2 px-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-1 text-lg font-medium" >
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {getSatusIcon(tastingDay)}
                        <p>{label}</p>
                      </div>
                      {
                        tastingDay.isDefault ? null : <TastingDayDialog tastingId={tastingDay.tastingId} id={tastingDay.id} />
                      }
                    </div>

                  </CardTitle>
                  <div className="w-6 h-6 rounded-full font-bold bg-muted-foreground text-white text-xs flex items-center justify-center">{wineries.length}</div>
                  {/* <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <TastingDayMenu tastingId={tastingDay.tastingId} tastingDayId={tastingDay.id} tastingDayDateStr={label} />
                  </div> */}
                </div>
              </CardHeader>
              <CardContent className="h-full px-2">
                <Droppable droppableId={tastingDay.id} type="winery">
                  {(provided) => (
                    <ol className="space-y-3 h-full" ref={provided.innerRef} {...provided.droppableProps}>
                      {wineries.map((winery, index) => (
                        <WineryCard key={winery.wineryId} winery={winery.winery} wines={wines.filter(wine => wine.wineryId === winery.wineryId)} index={index} />
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
      <div className="flex justify-center mt-2">
        {
          tastingDay.isDefault ? null : <DeleteTastingDayDialog id={tastingDay.id} description={`Seguro que quieres eliminar el tasting day del día ${label}?`} />
        }
      </div>
    </div>
  )
    
}

function getSatusIcon(tastingDay: KanbanTastingDayDAOWithWineries) {
  if (tastingDay.isDefault) return <CircleDashedIcon size={16} className={cn("mb-0.5")} />

  return <CircleIcon size={16} className={cn("mb-0.5")} />
}
