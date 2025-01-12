"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { TastingDayForm, DeleteTastingDayForm } from "./tastingday-forms"
import { PlusCircle, Pencil, Trash2, Calendar } from "lucide-react"
import { useState } from "react"

type Props= {
  id?: string
  tastingId: string
}

const addTrigger= <Button><PlusCircle size={22} className="mr-2"/>Create TastingDay</Button>
const updateTrigger= <Calendar size={18} className="hover:cursor-pointer"/>

export function TastingDayDialog({ id, tastingId }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {id ? updateTrigger : addTrigger }
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{id ? 'Actualizar' : 'Crear'} TastingDay</DialogTitle>
          <DialogDescription>
            {id ? 'Actualiza la fecha del tasting day:' : 'Define la fecha del tasting day:'}
          </DialogDescription>
        </DialogHeader>
        <TastingDayForm closeDialog={() => setOpen(false)} id={id} tastingId={tastingId} />
      </DialogContent>
    </Dialog>
  )
}
  
type DeleteProps= {
  id: string
  description: string
}

export function DeleteTastingDayDialog({ id, description }: DeleteProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Trash2 size={18} className="hover:cursor-pointer text-red-500"/>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar TastingDay</DialogTitle>
          <DialogDescription className="py-8">{description}</DialogDescription>
        </DialogHeader>
        <DeleteTastingDayForm closeDialog={() => setOpen(false)} id={id} />
      </DialogContent>
    </Dialog>
  )
}



