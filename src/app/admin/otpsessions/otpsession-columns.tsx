"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { formatWhatsAppStyle } from "@/lib/utils"
import { OTPSessionDAO } from "@/services/otpsession-services"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { ArrowUpDown, Laptop, Smartphone } from "lucide-react"
import { DeleteOTPSessionDialog, OTPSessionDialog } from "./otpsession-dialogs"


export const columns: ColumnDef<OTPSessionDAO>[] = [

  {
    accessorKey: "user",
    header: ({ column }) => {
      return (
        <Button variant="ghost" className="pl-0 dark:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          User
          <ArrowUpDown className="w-4 h-4 ml-1" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const data= row.original
      return (
        <div className="flex gap-2">
          <Avatar>
            <AvatarImage src={data.user.image || ""} className="object-cover"/>
            <AvatarFallback>{data.user.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="">
            <p>{data.user.name}</p>
            <p>{data.user.email}</p>
          </div>
        </div>
      )
    }
  },
  
  {
    accessorKey: "device",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Device
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
    cell: ({ row }) => {
      const data= row.original
      return (
        <div className="flex items-center gap-2">
          {isBrowserMobile(data.deviceBrowser || "") && <Smartphone className="w-8 h-8" />}
          {!isBrowserMobile(data.deviceBrowser || "") && <Laptop className="w-8 h-8" />}
          <div className="">
            <p>{data.deviceOs}</p>
            <p>{data.deviceBrowser}</p>
          </div>
        </div>
      )
    }
  },

  {
    accessorKey: "city",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            City
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
    cell: ({ row }) => {
      const data= row.original
      return (
        <div className="">
          <p>{data.city}</p>
          <p>{data.country}</p>
          <p>{data.ipAddress}</p>
        </div>
      )
    }
  },


  {
    accessorKey: "createdAt",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Dates
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
		cell: ({ row }) => {
      const data= row.original
      const isExpired= data.tokenCheckExpiration && data.tokenCheckExpiration < new Date()
      const formatString= isExpired ? "dd/MM/yyyy HH:mm:ss" : "HH:mm"
      const expiration= data.tokenCheckExpiration ? format(data.tokenCheckExpiration, formatString) : "No disponible"
      return (
        <div>
          <p>Creado: {formatWhatsAppStyle(data.createdAt.toISOString())}</p>
          <p>Actualizado: {formatWhatsAppStyle(data.updatedAt.toISOString())}</p>
          <p>Expira: <span className={`${isExpired ? "text-red-500" : "text-green-500"}`}>{expiration}</span></p>
        </div>
      )
    }
  },


  // {
  //   accessorKey: "role",
  //   header: ({ column }) => {
  //     return (
  //       <Button variant="ghost" className="pl-0 dark:text-white"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
  //         Rol
  //         <ArrowUpDown className="w-4 h-4 ml-1" />
  //       </Button>
  //     )
  //   },
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id))
  //   },
  // },
  {
    id: "actions",
    cell: ({ row }) => {
      const data= row.original

      const deleteDescription= `Do you want to delete OTPSession ${data.id}?`
 
      return (
        <div className="flex items-center justify-end gap-2">

          <OTPSessionDialog id={data.id} />
          <DeleteOTPSessionDialog description={deleteDescription} id={data.id} />
        </div>

      )
    },
  },
]



export function isBrowserMobile(userAgent: string) {
  return userAgent.includes("Mobile")
}