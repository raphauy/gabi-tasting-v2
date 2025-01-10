"use client"

import { Button } from "@/components/ui/button"
import { TastingDayDAO } from "@/services/tastingday-services"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { format } from "date-fns"
import { DeleteTastingDayDialog, TastingDayDialog } from "./tastingday-dialogs"


export const columns: ColumnDef<TastingDayDAO>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Fecha
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
		cell: ({ row }) => {
      const data= row.original
      const date= data.date && format(new Date(data.date), "yyyy-MM-dd")
      return (<p>{date}</p>)
    }
  },

  {
    accessorKey: "isDefault",
    header: ({ column }) => {
      return (<p>Default</p>)
    }
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const data= row.original

      const deleteDescription= `Do you want to delete TastingDay ${data.id}?`
 
      return (
        <div className="flex items-center justify-end gap-2">

          <TastingDayDialog id={data.id} tastingId={data.tastingId} />
          <DeleteTastingDayDialog description={deleteDescription} id={data.id} />
        </div>

      )
    },
  },
]


