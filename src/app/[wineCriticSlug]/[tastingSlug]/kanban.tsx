"use client"

import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd'
import { toast } from "@/hooks/use-toast";
import { TastingDAO } from "@/services/tasting-services";
import { KanbanTastingDayDAO, KanbanTastingDayDAOWithWineries, TastingDayDAO } from "@/services/tastingday-services";
import { useEffect, useState } from "react";
import { updateKanbanTastingDaysAction, updateTastingDaysWineriesAction } from "./tastingdays/tastingday-actions";
import { WineryTastingDAO } from "@/services/winerytasting-services";
import { TastingDayWineryDAO } from '@/services/tastingdaywinery-services';
import TastingDayColumn from './tasting-day-column';
import { TastingDayDialog } from './tastingdays/tastingday-dialogs';
import { WineDAO } from '@/services/wine-services';

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

type Props = {
  tasting: TastingDAO;
  wines: WineDAO[];
  initialTastingDays: KanbanTastingDayDAOWithWineries[];
};

export default function Kanban({ tasting, wines, initialTastingDays }: Props) {
  const [tastingDays, setTastingDays] = useState<KanbanTastingDayDAOWithWineries[]>(initialTastingDays)

  useEffect(() => {
    setTastingDays(initialTastingDays)
  }, [initialTastingDays])

  function updateKanbanTastingDays(orderedTastingDays: KanbanTastingDayDAO[]) {
    updateKanbanTastingDaysAction(tasting.id, orderedTastingDays)
    .then(() => {
      toast({title: "Tasting days reordered"})
    })
    .catch((error) => {
      console.error(error)
    })
  }

  function updateTastingDayWinery(wineries: TastingDayWineryDAO[]) {
    updateTastingDaysWineriesAction(wineries)
    .then(() => {
      toast({title: "Wineries actualizadas"})
    })
    .catch((error) => {
      console.error(error)
    })
  }

  const onDragEnd = (result: DropResult) => {
    const { destination, source, type } = result
    if (!destination) return
    // if dropped in the same position
    if (destination.droppableId === source.droppableId && destination.index === source.index) return
    // User moves a list
    if (type === 'list') {
      const newTastingDays = reorder(tastingDays, source.index, destination.index).map((item, index) => ({ ...item, order: index }))
      setTastingDays(newTastingDays)
      updateKanbanTastingDays(newTastingDays as KanbanTastingDayDAO[])
    }
    // User moves a winery
    if (type === 'winery') {
      const newOrderedData = [...tastingDays]

      // Source and destination lists
      const sourceList = newOrderedData.find(list => list.id === source.droppableId)
      const destinationList = newOrderedData.find(list => list.id === destination.droppableId)
      if (!sourceList || !destinationList) return

      // Check if wineries exist in the source list
      if (!sourceList.wineries) {
        sourceList.wineries = []
      }

      // Check if wineries exist in the destination list
      if (!destinationList.wineries) {
        destinationList.wineries = []
      }

      // Moving the winery in the same list
      if (source.droppableId === destination.droppableId) {
        const reorderedWineries = reorder(sourceList.wineries, source.index, destination.index)
        reorderedWineries.forEach((winery, index) => winery.order = index)
        sourceList.wineries = reorderedWineries
        setTastingDays(newOrderedData)
        updateTastingDayWinery(reorderedWineries)
      }

      // Moving the winery to another list
      if (source.droppableId !== destination.droppableId) {
        // Remove winery from source list
        const [movedWinery] = sourceList.wineries.splice(source.index, 1)

        // Assign the new tasting day to the moved winery
        movedWinery.tastingDayId = destination.droppableId

        // Add winery to the destination list
        destinationList.wineries.splice(destination.index, 0, movedWinery)

        // Update order of wineries in source and destination lists
        sourceList.wineries.forEach((winery, index) => winery.order = index)

        // Update order of wineries in destination list
        destinationList.wineries.forEach((winery, index) => winery.order = index)

        setTastingDays(newOrderedData)
        updateTastingDayWinery(destinationList.wineries)        
      }
    }
  }

  return (
    <div>
      <div className="flex items-center gap-2 max-w-[820px] w-full mb-4">

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="tastingDays" type='list' direction='horizontal'>
            {(provided) => (
              <ol className="flex gap-x-2 h-full min-h-[500px]" ref={provided.innerRef} {...provided.droppableProps}>
                {tastingDays.map((tastingDay, index) => (
                  <TastingDayColumn key={tastingDay.id} tastingDay={tastingDay} index={index} wines={wines} wineCriticSlug={tasting.wineCritic.slug} tastingSlug={tasting.slug} />
                ))}
                {provided.placeholder}
                <TastingDayDialog tastingId={tasting.id} />
                <div className='flex-shrink-0 w-1' />
              </ol>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  )
}