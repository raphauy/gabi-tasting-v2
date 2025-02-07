"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Settings } from "lucide-react"
import { useState } from "react"
import { getWineCriticTastingNotePromptAction, setWineCriticTastingNotePromptAction } from "@/app/admin/winecritics/winecritic-actions"
import { toast } from "@/hooks/use-toast"

type Props = {
    wineCriticSlug: string
}

export function EditPromptDialog({ wineCriticSlug }: Props) {
    const [open, setOpen] = useState(false)
    const [prompt, setPrompt] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    async function loadPrompt() {
        try {
            const currentPrompt = await getWineCriticTastingNotePromptAction(wineCriticSlug)
            setPrompt(currentPrompt)
        } catch (error) {
            console.error(error)
            toast({
                title: "Error al cargar el prompt",
                description: "No se pudo cargar el prompt actual",
                variant: "destructive",
            })
        }
    }

    async function handleSave() {
        try {
            setIsLoading(true)
            await setWineCriticTastingNotePromptAction(wineCriticSlug, prompt)
            toast({
                title: "Prompt guardado",
                description: "El prompt se ha actualizado correctamente",
            })
            setOpen(false)
        } catch (error) {
            console.error(error)
            toast({
                title: "Error al guardar",
                description: "No se pudo guardar el prompt",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={(isOpen) => {
            setOpen(isOpen)
            if (isOpen) {
                loadPrompt()
            }
        }}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    title="Editar prompt"
                >
                    <Settings className="w-4 h-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[1000px] h-[75vh]">
                <DialogHeader>
                    <DialogTitle>Editar Prompt</DialogTitle>
                    <DialogDescription>
                        Personaliza el prompt que se utilizará para generar las notas de cata.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex-1 py-4">
                    <Textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="min-h-[600px] font-mono text-sm"
                        placeholder="Ingresa el prompt para generar notas de cata..."
                        disabled={isLoading}
                    />
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={isLoading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isLoading}
                    >
                        Guardar cambios
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
} 