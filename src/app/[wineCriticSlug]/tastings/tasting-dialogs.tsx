"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { TastingForm, DeleteTastingForm } from "./tasting-forms"
import { PlusCircle, Pencil, Trash2 } from "lucide-react"
import { useState } from "react"

type Props= {
  id?: string
  wineCriticId: string
}

const addTrigger= <Button><PlusCircle size={22} className="mr-2"/>Create Tasting</Button>
const updateTrigger= <Pencil size={30} className="pr-2 hover:cursor-pointer"/>

export function TastingDialog({ id, wineCriticId }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {id ? updateTrigger : addTrigger }
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{id ? 'Update' : 'Create'} Tasting</DialogTitle>
          <DialogDescription>
            {id ? 'Update the Tasting with the following fields:' : 'Create a new Tasting with the following fields:'}
          </DialogDescription>
        </DialogHeader>
        <TastingForm closeDialog={() => setOpen(false)} id={id} wineCriticId={wineCriticId} />
      </DialogContent>
    </Dialog>
  )
}
  
type DeleteProps= {
  id: string
  description: string
}

export function DeleteTastingDialog({ id, description }: DeleteProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Trash2 className="hover:cursor-pointer"/>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Tasting</DialogTitle>
          <DialogDescription className="py-8">{description}</DialogDescription>
        </DialogHeader>
        <DeleteTastingForm closeDialog={() => setOpen(false)} id={id} />
      </DialogContent>
    </Dialog>
  )
}



