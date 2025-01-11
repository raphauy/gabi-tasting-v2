"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pencil, PlusCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { DeleteUserForm, UserForm } from "./user-forms";
import { Role } from "@prisma/client";

type Props= {
  id?: string
  role: Role
  wineCriticId?: string
  wineryId?: string
}

const updateTrigger= <Pencil size={30} className="pr-2 hover:cursor-pointer"/>

export function UserDialog({ id, role, wineCriticId, wineryId }: Props) {
  const [open, setOpen] = useState(false);

  const addTrigger= <Button><PlusCircle size={22} className="mr-2"/>Crear usuario {role !== Role.WINERY ? role : ''}</Button>

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {id ? updateTrigger : addTrigger }
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{id ? 'Actualizar' : 'Crear'} {role} User</DialogTitle>
          <DialogDescription>
            {id ? 'Actualiza la información del usuario.' : 'Introduce la información del usuario.'}
          </DialogDescription>
        </DialogHeader>
        <UserForm closeDialog={() => setOpen(false)} id={id} role={role} wineCriticId={wineCriticId} wineryId={wineryId} />
      </DialogContent>
    </Dialog>
  )
}
  
type DeleteProps= {
  id: string
  description: string
}

export function DeleteUserDialog({ id, description }: DeleteProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Trash2 className="hover:cursor-pointer"/>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete User</DialogTitle>
          <DialogDescription className="py-8">{description}</DialogDescription>
        </DialogHeader>
        <DeleteUserForm closeDialog={() => setOpen(false)} id={id}/>
      </DialogContent>
    </Dialog>
  )
}

interface CollectionProps{
  id: string
  title: string
}




  
