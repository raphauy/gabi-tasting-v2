"use client"

import { Button } from "@/components/ui/button"
import { WineDAO } from "@/services/wine-services"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { format } from "date-fns"
import { DeleteWineDialog, WineDialog } from "./wine-dialogs"
import Link from "next/link"


export const columns: ColumnDef<WineDAO>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button variant="ghost" className="pl-0 dark:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Name
          <ArrowUpDown className="w-4 h-4 ml-1" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const data= row.original
      return (
        <Link href={`/winery/${data.winery.slug}/${data.tastings[0].slug}/${data.id}`}>
          <Button variant="link" className="px-0">
            {data.name}
          </Button>
        </Link>
      )
    },
    filterFn: (row, id, value) => {
      const data = row.original
      const valueLower = value.toLowerCase()
      return !!(data.name?.toLowerCase().includes(valueLower) ||
        data.vintage?.toLowerCase().includes(valueLower) ||
        data.region?.toLowerCase().includes(valueLower) ||
        data.style?.toLowerCase().includes(valueLower) ||
        data.abv?.toString().includes(valueLower) ||
        data.price?.toString().includes(valueLower))
    },
  },
  
  {
    accessorKey: "vintage",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Vintage
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
  },

  {
    accessorKey: "region",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Region
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
  },

  {
    accessorKey: "style",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Style
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
  },

  {
    accessorKey: "abv",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Abv
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
  },

  {
    accessorKey: "price",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Price
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
  },

  {
    accessorKey: "updatedAt",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Actualizado
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
		cell: ({ row }) => {
      const data= row.original
      const date= data.updatedAt && format(new Date(data.updatedAt), "yyyy-MM-dd")
      return (<p>{date}</p>)
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const data= row.original

      const deleteDescription= `¿Estás seguro de que deseas eliminar el vino ${data.name}?`
 
      return (
        <div className="flex items-center justify-end gap-2">
          <DeleteWineDialog description={deleteDescription} id={data.id} />
        </div>

      )
    },
  },
]


