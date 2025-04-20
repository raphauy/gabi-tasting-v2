"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { useSearchParams } from "next/navigation"

type ExportButtonProps = {
  tastingId: string
}

export default function ExportButton({ tastingId }: ExportButtonProps) {
  const searchParams = useSearchParams()
  const wineryId = searchParams.get("wineryId")
  
  const handleExport = () => {
    let exportUrl = `/api/export?tastingId=${tastingId}`
    
    // Si hay un filtro de bodega activo, incluirlo en la URL de exportación
    if (wineryId) {
      exportUrl += `&wineryId=${wineryId}`
    }
    
    window.location.href = exportUrl
  }

  // Texto del botón que cambia dependiendo de si hay filtro o no
  const buttonText = wineryId 
    ? "Exportar bodega filtrada" 
    : "Exportar todas las bodegas"

  return (
    <Button 
      onClick={handleExport}
      className="flex items-center gap-2" 
      variant="outline"
    >
      <Download className="h-4 w-4" />
      <span>{buttonText}</span>
    </Button>
  )
} 