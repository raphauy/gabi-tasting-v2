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
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

type Props= {
  id: string
  label?: string
  fieldName: string
  initialValue: string | number | boolean | undefined
  update: (id: string, fieldName: string, newValue: string | number | boolean | undefined) => Promise<boolean>
  type: "input" | "textarea" | "select" | "number" | "boolean"
  selectOptions?: string[]
  min?: number
  max?: number
  step?: number
}

export function TextForm({ id, label, fieldName, initialValue, update, type, selectOptions, min, max, step = 1 }: Props) {

  const [isEditing, setIsEditing] = useState(false)
  const toggleEdit = () => setIsEditing(!isEditing)

  const [loading, setLoading] = useState(false)
  const [newValue, setNewValue] = useState(() => {
    if (initialValue === null || initialValue === undefined) return ""
    if (type === "number") return initialValue.toString()
    if (type === "boolean") return initialValue
    return initialValue.toString()
  })

  async function onSubmit() {
    if (type === "boolean") return // Los booleanos se manejan en su propio onChange

    if (newValue === initialValue?.toString()) {
      setIsEditing(false)
      return
    }

    // Validación específica para números
    if (type === "number") {
      const numValue = Number(newValue)
      if (isNaN(numValue)) {
        toast({ title: "El valor debe ser un número", variant: "destructive" })
        return
      }
      if (min !== undefined && numValue < min) {
        toast({ title: `El valor mínimo es ${min}`, variant: "destructive" })
        return
      }
      if (max !== undefined && numValue > max) {
        toast({ title: `El valor máximo es ${max}`, variant: "destructive" })
        return
      }

      setLoading(true)
      toggleEdit()
      const ok = await update(id, fieldName, numValue)
      
      if (ok) {
        toast({title: "Valor editado" })
      } else {      
        toast({title: "Error al editar el valor", variant: "destructive"})
      }
      
      setLoading(false)
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

  async function onBooleanChange(checked: boolean) {
    setNewValue(checked)
    setLoading(true)
    
    const ok = await update(id, fieldName, checked)
    if (ok) {
      toast({title: "Valor editado" })
    } else {      
      toast({title: "Error al editar el valor", variant: "destructive"})
    }
    
    setLoading(false)
  }

  function handleEnterKey(e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey && (type === "input" || type === "number")) {
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
        value={newValue?.toString() || undefined}
        onValueChange={onSelectChange}
        disabled={loading}
      >
        <SelectTrigger className={cn(
          "w-full text-sm font-bold border-0",
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

    if (type === "boolean") {
      return (
        <Switch
          checked={newValue as boolean}
          onCheckedChange={onBooleanChange}
          disabled={loading}
        />
      )
    }

    const commonProps = {
      name: fieldName,
      className: "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      autoFocus: true,
      disabled: !isEditing,
      value: newValue as string,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setNewValue(e.target.value),
      onKeyDown: handleEnterKey,
      onBlur: onSubmit
    }

    if (type === "number") {
      return (
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            {...commonProps}
            className={cn(
              commonProps.className,
              "h-10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            )}
          />
          {(min !== undefined || max !== undefined) && (
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {min !== undefined && max !== undefined ? `${min}-${max}` : 
               min !== undefined ? `Min: ${min}` : 
               max !== undefined ? `Max: ${max}` : ''}
            </span>
          )}
        </div>
      )
    }

    return type === "input" ? (
      <input
        {...commonProps}
        className={`${commonProps.className} h-10`}
      />
    ) : (
      <textarea
        rows={8}
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

    if (type === "boolean") {
      return (
        <Switch
          checked={newValue as boolean}
          onCheckedChange={onBooleanChange}
          disabled={loading}
        />
      )
    }

    return (
      <Button
        onClick={toggleEdit}
        variant="ghost"
        className="w-full p-0 h-auto font-bold hover:bg-transparent"
      >
        <div className={`text-sm w-full text-left ${type === "textarea" ? "whitespace-pre-wrap" : "truncate"}`}>
          {newValue || "Sin valor"}
        </div>
      </Button>
    )
  }

  return (
    <div className="mt-1.5 border bg-slate-100 rounded-md p-2 dark:bg-black relative">
      <div className="font-medium flex flex-col">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            {type !== "boolean" && <Tag className="h-4 w-4" />}
            <p>{label || fieldName}:</p>
          </div>
          {!isEditing && !loading && type !== "select" && type !== "boolean" && (
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
          {isEditing && type !== "select" && type !== "boolean" ? (
            <div className="font-medium">
              {renderEditField()}
            </div>
          ) : renderValue()}
        </div>
      </div>
    </div>
  )
}