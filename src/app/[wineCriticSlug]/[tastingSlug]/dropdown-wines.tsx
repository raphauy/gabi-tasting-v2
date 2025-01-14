"use client"

import * as React from "react"
import { WineDAO } from "@/services/wine-services"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

type Props = {
  wines: WineDAO[]
}

export default function DropdownWines({ wines }: Props) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full space-y-2"
    >
      <CollapsibleTrigger className="flex w-full items-center justify-between hover:bg-muted mt-2 text-muted-foreground border-t pt-3">
        <div className="flex items-center space-x-2">
          <div className="rounded-full p-2 w-7 h-7 border bg-green-500 text-white flex items-center justify-center font-bold">
            {wines.length}
          </div>
          <p>vino{wines.length > 1 ? 's' : ''}</p>
        </div>
        <ChevronDown className={cn(
          "h-4 w-4 transition-transform duration-200",
          isOpen && "rotate-180"
        )} />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2">
        {wines.map((wine) => (
          <div key={wine.id} className="rounded-md border p-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">{wine.name}</span>
              <span className="text-muted-foreground">{wine.vintage}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <Badge variant="secondary">{wine.style}</Badge>
              <span>{wine.price ? `$${wine.price}` : 'Sin precio'}</span>
            </div>
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}