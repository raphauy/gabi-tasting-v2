"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { WineForm, DeleteWineForm } from "./wine-forms"
import { PlusCircle, Pencil, Trash2 } from "lucide-react"
import { useState } from "react"

type Props= {
  id?: string
  wineryId: string
  tastingId?: string
}

const addTrigger= <Button><PlusCircle size={22} className="mr-2"/>Create Wine</Button>
const updateTrigger= <Pencil size={25} className="pr-2 hover:cursor-pointer"/>

export function WineDialog({ id, wineryId, tastingId }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {id ? updateTrigger : addTrigger }
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>{id ? 'Update' : 'Create'} Wine</DialogTitle>
          <DialogDescription>
            {id ? 'Update the Wine with the following fields:' : 'Create a new Wine with the following fields:'}
          </DialogDescription>
        </DialogHeader>
        <WineForm closeDialog={() => setOpen(false)} id={id} wineryId={wineryId} tastingId={tastingId} />
      </DialogContent>
    </Dialog>
  )
}
  
type DeleteProps= {
  id: string
  description: string
}

export function DeleteWineDialog({ id, description }: DeleteProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Trash2 className="hover:cursor-pointer text-red-500"/>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Wine</DialogTitle>
          <DialogDescription className="py-8">{description}</DialogDescription>
        </DialogHeader>
        <DeleteWineForm closeDialog={() => setOpen(false)} id={id} />
      </DialogContent>
    </Dialog>
  )
}



