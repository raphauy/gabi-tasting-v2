"use client"

import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { Loader, Pencil, Tag } from "lucide-react"
import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

type Props= {
  id: string
  label?: string
  fieldName: string
  initialValue: string
  update: (id: string, fieldName: string, newValue: string) => Promise<boolean>
  type: "input" | "textarea" | "select"
  selectOptions?: string[]
}

export function TextForm({ id, label, fieldName, initialValue, update, type, selectOptions }: Props) {

  const [isEditing, setIsEditing] = useState(false)
  const toggleEdit = () => setIsEditing(!isEditing)

  const [loading, setLoading] = useState(false)
  const [newValue, setNewValue] = useState(initialValue === "null" ? "" : initialValue)

  async function onSubmit() {
    if (newValue === initialValue) {
      setIsEditing(false)
      return
    }

    setLoading(true)
    toggleEdit()
    const ok= await update(id, fieldName, newValue)
    
    if (ok) {
      toast({title: "Valor editado" })
    } else {      
      toast({title: "Error al editar el valor", variant: "destructive"})
    }

    setLoading(false)
  }

  async function onSelectChange(value: string) {
    setNewValue(value)
    setLoading(true)
    
    const ok = await update(id, fieldName, value)
    if (ok) {
      toast({title: "Valor editado" })
    } else {      
      toast({title: "Error al editar el valor", variant: "destructive"})
    }
    
    setLoading(false)
  }

  function handleEnterKey(e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey && type === "input") {
      e.preventDefault()
      onSubmit()
    }
  }

  const renderSelect = () => {
    if (!selectOptions?.length) {
      return <p className="text-red-500">Error: No hay opciones disponibles para el select</p>
    }

    return (
      <Select
        value={newValue || undefined}
        onValueChange={onSelectChange}
        disabled={loading}
      >
        <SelectTrigger className={cn(
          "w-full text-xl font-bold border-0",
          "bg-background hover:bg-background/80 transition",
          "focus:ring-0 focus:ring-offset-0",
          "data-[placeholder]:text-muted-foreground/60"
        )}>
          <SelectValue placeholder="Selecciona una opción" />
        </SelectTrigger>
        <SelectContent>
          {selectOptions.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }

  const renderEditField = () => {
    if (type === "select") {
      return renderSelect()
    }

    const commonProps = {
      name: fieldName,
      className: "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      autoFocus: true,
      disabled: !isEditing,
      value: newValue,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setNewValue(e.target.value),
      onKeyDown: handleEnterKey,
      onBlur: onSubmit
    }

    return type === "input" ? (
      <input
        {...commonProps}
        className={`${commonProps.className} h-10`}
      />
    ) : (
      <textarea
        rows={4}
        {...commonProps}
        className={`${commonProps.className} min-h-[60px] resize-none`}
      />
    )
  }

  const renderValue = () => {
    if (loading) {
      return (
        <div className="h-10 flex items-center">
          <Loader className="animate-spin" />
        </div>
      )
    }

    if (type === "select") {
      return renderSelect()
    }

    return (
      <Button
        onClick={toggleEdit}
        variant="ghost"
        className="w-full p-0 h-auto font-bold hover:bg-transparent"
      >
        <div className={`text-xl w-full text-left ${type === "textarea" ? "whitespace-pre-wrap" : "truncate"}`}>
          {newValue || "Sin valor"}
        </div>
      </Button>
    )
  }

  return (
    <div className="mt-3 border bg-slate-100 rounded-md p-4 dark:bg-black relative">
      <div className="font-medium flex flex-col">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <Tag className="h-4 w-4" />
            <p>{label || fieldName}:</p>
          </div>
          {!isEditing && !loading && type !== "select" && (
            <Button 
              onClick={toggleEdit}
              variant="ghost"
              size="icon"
              className="h-8 w-8 absolute right-4 top-4">
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="mt-2">
          {isEditing && type !== "select" ? (
            <div className="font-medium">
              {renderEditField()}
            </div>
          ) : renderValue()}
        </div>
      </div>
    </div>
  )
}