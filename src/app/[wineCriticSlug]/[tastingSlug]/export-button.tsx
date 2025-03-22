"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

type ExportButtonProps = {
  tastingId: string
}

export default function ExportButton({ tastingId }: ExportButtonProps) {
  const handleExport = () => {
    window.location.href = `/api/export?tastingId=${tastingId}`;
  }

  return (
    <Button 
      onClick={handleExport}
      className="flex items-center gap-2" 
      variant="outline"
    >
      <Download className="h-4 w-4" />
      <span>Exportar a Excel</span>
    </Button>
  )
} 