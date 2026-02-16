"use client"

import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Copy, List, Loader, SaveIcon, Sparkles } from "lucide-react"
import { useEffect, useState } from 'react'
import { generateTastingNoteAction, setTastingNoteAction } from "../reviews/review-actions"
import { EditPromptDialog } from "./edit-prompt-dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

type Props = {
    reviewId: string
    initialTastingNote: string
    wineCriticSlug: string
}

export function TastingNoteBox({ reviewId, initialTastingNote, wineCriticSlug }: Props) {
    const [isSaving, setIsSaving] = useState(false)
    const [hasChanges, setHasChanges] = useState(false)
    const [isGenerating, setIsGenerating] = useState(false)
    const [isGeneratingStream, setIsGeneratingStream] = useState(false)
    const [includePdf, setIncludePdf] = useState(false)
    const [isCopying, setIsCopying] = useState(false)

    const editor = useEditor({
        extensions: [
            StarterKit,
        ],
        content: initialTastingNote,
        editorProps: {
            attributes: {
                class: 'prose prose-sm mx-auto focus:outline-none min-h-[180px] p-3 [&>h2]:text-base [&>h2]:font-bold [&>h2]:mt-3 [&>h2]:mb-1.5 [&>h3]:text-sm [&>h3]:font-semibold [&>h3]:mt-2 [&>h3]:mb-1.5 [&>ul]:list-disc [&>ul]:pl-5',
            },
        },
        onUpdate: () => {
            setHasChanges(true)
        },
        immediatelyRender: false,
    })

    useEffect(() => {
        if (editor && initialTastingNote !== editor.getHTML()) {
            editor.commands.setContent(initialTastingNote)
            setHasChanges(false)
        }
    }, [initialTastingNote, editor])

    async function handleSave() {
        if (!editor || !hasChanges) return

        try {
            setIsSaving(true)
            await setTastingNoteAction(reviewId, editor.getHTML())
            setHasChanges(false)
            toast({
                title: "Nota de cata guardada",
                description: "La nota de cata se ha guardado correctamente",
                duration: 3000,
            })
        } catch (error) {
            toast({
                title: "Error al guardar la nota de cata",
                description: "Hubo un error al guardar la nota de cata",
                variant: "destructive",
                duration: 3000,
            })
            console.error(error)
        } finally {
            setIsSaving(false)
        }
    }

    async function handleGenerate() {
        if (!editor) return

        try {
            setIsGenerating(true)
            const generatedNote = await generateTastingNoteAction(reviewId, wineCriticSlug, includePdf)
            editor.commands.setContent(generatedNote)
            setHasChanges(true)
            toast({
                title: "Nota de cata generada",
                description: "Se ha generado una nueva nota de cata",
                duration: 3000,
            })
        } catch (error) {
            toast({
                title: "Error al generar la nota de cata",
                description: "Hubo un error al generar la nota de cata",
                variant: "destructive",
                duration: 3000,
            })
            console.error(error)
        } finally {
            setIsGenerating(false)
        }
    }

    async function handleCopy() {
        if (!editor) return

        try {
            setIsCopying(true)
            
            // Obtener el contenido HTML y extraer solo el texto
            const html = editor.getHTML();
            
            // Crear un elemento temporal
            const tempElement = document.createElement('div');
            tempElement.innerHTML = html;
            
            // Obtener solo el texto (sin las etiquetas HTML)
            const textOnly = tempElement.textContent || tempElement.innerText || '';
            
            // Verificar si la API de clipboard está disponible
            if (navigator?.clipboard?.writeText) {
                // Método moderno de copiar al portapapeles
                await navigator.clipboard.writeText(textOnly);
            } else {
                // Método alternativo utilizando document.execCommand (para navegadores más antiguos)
                const textarea = document.createElement('textarea');
                textarea.value = textOnly;
                textarea.style.position = 'fixed'; // Evita desplazamiento
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                
                const successful = document.execCommand('copy');
                document.body.removeChild(textarea);
                
                if (!successful) {
                    throw new Error('No se pudo copiar el texto');
                }
            }
            
            toast({
                title: "Texto copiado",
                description: "El texto de la nota de cata ha sido copiado al portapapeles",
                duration: 3000,
            })
        } catch (error) {
            toast({
                title: "Error al copiar",
                description: "No se pudo copiar el texto al portapapeles",
                variant: "destructive",
                duration: 3000,
            })
            console.error(error)
        } finally {
            setIsCopying(false)
        }
    }

    if (!editor) {
        return null
    }

    return (
        <div className="space-y-2 mb-8">
            <h2 className="text-lg font-semibold">Nota de cata</h2>
            <div className="border rounded-lg">
                <div className="border-b p-2 flex gap-2 bg-muted flex-wrap items-center justify-between">
                    <div className="flex gap-2 flex-wrap">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => editor.chain().focus().toggleBold().run()}
                            className={editor.isActive('bold') ? 'bg-accent' : ''}
                            title="Negrita"
                        >
                            <span className="font-bold">B</span>
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                            className={editor.isActive('heading', { level: 2 }) ? 'bg-accent' : ''}
                            title="Título 2"
                        >
                            H2
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                            className={editor.isActive('heading', { level: 3 }) ? 'bg-accent' : ''}
                            title="Título 3"
                        >
                            H3
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => editor.chain().focus().toggleBulletList().run()}
                            className={editor.isActive('bulletList') ? 'bg-accent' : ''}
                            title="Lista con viñetas"
                        >
                            <List className="w-4 h-4" />
                        </Button>
                    </div>
                    <div className="flex gap-2">
                        <div className="flex items-center gap-2">
                            <Label>Incluir PDF</Label>
                            <Switch
                                checked={includePdf}
                                onCheckedChange={setIncludePdf}
                                title="Incluir PDF"
                            />
                        </div>
                        <Button 
                            onClick={handleGenerate}
                            disabled={isGenerating || isGeneratingStream}
                            size="sm"
                            variant="outline"
                            title="Generar con IA"
                        >
                            { isGenerating ? <Loader className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" /> }
                        </Button>
                        <EditPromptDialog wineCriticSlug={wineCriticSlug} />
                    </div>
                </div>
                <EditorContent editor={editor} />
                <div className="p-2 flex justify-end border-t gap-2">
                    <Button 
                        onClick={handleCopy}
                        size="sm"
                        variant="outline"
                        title="Copiar texto al portapapeles"
                    >
                        { isCopying ? <Loader className="w-4 h-4 mr-2 animate-spin" /> : <Copy className="w-4 h-4 mr-2" /> }
                        Copiar texto
                    </Button>
                    <Button 
                        onClick={handleSave}
                        disabled={!hasChanges || isSaving}
                        size="sm"
                    >
                        { isSaving ? <Loader className="w-4 h-4 mr-2 animate-spin" /> : <SaveIcon className="w-4 h-4 mr-2" /> }
                        Guardar
                    </Button>
                </div>
            </div>
        </div>
    )
}