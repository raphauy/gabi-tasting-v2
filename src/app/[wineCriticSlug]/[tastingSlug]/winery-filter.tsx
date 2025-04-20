"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type WineryOption = {
  value: string
  label: string
}

type Props = {
  wineries: WineryOption[]
  tastingSlug: string
  wineCriticSlug: string
}

export function WineryFilter({ wineries, tastingSlug, wineCriticSlug }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")
  
  // Obtener el valor actual del filtro desde searchParams
  const currentWineryId = searchParams.get("wineryId") || ""
  
  // Encontrar el nombre de la bodega seleccionada
  const selectedWinery = wineries.find(winery => winery.value === currentWineryId)

  // Filtrar las bodegas según el texto de búsqueda
  const filteredWineries = React.useMemo(() => {
    if (!inputValue) return wineries
    
    const searchTerm = inputValue.toLowerCase()
    return wineries.filter(winery => 
      winery.label.toLowerCase().includes(searchTerm)
    )
  }, [wineries, inputValue])

  // Manejar la selección de una bodega
  const handleSelect = (value: string) => {
    // Si seleccionamos la misma bodega, limpiar el filtro
    if (value === currentWineryId) {
      // Crear nueva URL sin el parámetro wineryId
      const params = new URLSearchParams(searchParams)
      params.delete("wineryId")
      router.push(`/${wineCriticSlug}/${tastingSlug}?${params.toString()}`)
    } else {
      // Crear nueva URL con el parámetro wineryId
      const params = new URLSearchParams(searchParams)
      params.set("wineryId", value)
      router.push(`/${wineCriticSlug}/${tastingSlug}?${params.toString()}`)
    }
    setOpen(false)
  }

  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  return (
    <div className="flex items-center">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="min-w-[300px] justify-between w-full"
          >
            {selectedWinery ? selectedWinery.label : "Filtrar por bodega"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command shouldFilter={false}>
            <CommandInput 
              placeholder="Buscar bodega..." 
              value={inputValue}
              onValueChange={handleInputChange}
            />
            <CommandList>
              <CommandEmpty>No se encontraron bodegas.</CommandEmpty>
              <CommandGroup>
                {filteredWineries.map((winery) => (
                  <CommandItem
                    key={winery.value}
                    value={winery.value}
                    onSelect={handleSelect}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        currentWineryId === winery.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {winery.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
} 