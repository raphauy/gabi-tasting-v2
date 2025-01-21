"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { WineFormValues, WineSchema } from '@/services/wine-services'
import { zodResolver } from "@hookform/resolvers/zod"
import { WineStyle } from "@prisma/client"
import { FileText, Loader } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { createOrUpdateWineAction, deleteWineAction, getWineDAOAction } from "./wine-actions"
import { DeleteWineDialog } from "./wine-dialogs"
import { UploadButton } from "@/lib/uploadthing"

const styles= Object.values(WineStyle)

type Props = {
  id?: string
  wineryId: string
  tastingId?: string
  closeDialog?: () => void
}

export function WineForm({ id, wineryId, tastingId, closeDialog }: Props) {
  const form = useForm<WineFormValues>({
    resolver: zodResolver(WineSchema),
    defaultValues: {
      name: "",
      vintage: "",
      grapes: "",
      region: "",
      abv: "",
      price: "",
      technicalFileUrl: "",
      wineryId,
      tastingId
    },
    mode: "onChange",
  })
  const fileName= form.watch('technicalFileName')
  const [loading, setLoading] = useState(false)
  const { isDirty } = form.formState
  const router = useRouter()

  const onSubmit = async (data: WineFormValues) => {
    setLoading(true)
    try {
      const updated= await createOrUpdateWineAction(id ? id : null, data)
      if (!updated) {
        toast({ title: "Error", description: "No se pudo crear o actualizar el vino", variant: "destructive" })
        return
      }
      toast({ title: id ? "Vino actualizado" : "Vino creado" })
      form.reset(data)
      if (closeDialog) {
        closeDialog()
      } else {
        router.push(`/winery/${updated.winery.slug}/${updated.tastings[0].slug}`)
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      getWineDAOAction(id).then((data) => {
        if (data) {
          form.reset({
            ...data,
            abv: data.abv ? data.abv.toString() : undefined,
            price: data.price ? data.price.toString() : undefined,
            technicalFileUrl: data.technicalFileUrl || undefined,
            tastingId
          })
        }
        Object.keys(form.getValues()).forEach((key: any) => {
          if (form.getValues(key) === null) {
            form.setValue(key, "")
          }
        })
      })
    }
  }, [form, id, tastingId])

  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm max-w-xl mx-auto w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre del vino" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vintage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Añada</FormLabel>
                  <FormControl>
                    <Input placeholder="Añada del vino" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="grapes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cepas (separadas por comas)</FormLabel>
                  <FormControl>
                    <Input placeholder="Cepas del vino" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Región</FormLabel>
                  <FormControl>
                    <Input placeholder="Región del vino" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="style"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estilo</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un estilo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {styles.map(style => (
                        <SelectItem key={style} value={style}>{style}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="abv"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Graduación alcohólica</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Graduación del vino" 
                      {...field} 
                      onChange={(e) => {
                        const value = e.target.value.replace(',', '.')
                        field.onChange(value)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio</FormLabel>
                  <FormDescription>Precio del vino en moneda local, mercado local</FormDescription>
                  <FormControl>
                    <Input placeholder="Precio del vino" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="technicalFileUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ficha Técnica (PDF)</FormLabel>
                <FormDescription>La Ficha Técnica es opcional pero recomendada.</FormDescription>
                <div className="flex items-start justify-between pt-5">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {fileName && (
                      <>
                        <FileText className="h-4 w-4" />
                        <Button 
                          variant="link" 
                          className="p-0 h-auto"
                          asChild
                        >
                          <a 
                            href={field.value} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            {fileName}
                          </a>
                        </Button>
                      </>
                    )}
                  </div>
                  <div className={cn("flex", fileName ? "justify-end" : "w-full")}>
                    <UploadButton
                      endpoint="pdfUploader"
                      className={cn(fileName ? "ut-button:w-auto" : "w-full")}
                      content={{                      
                        button({ ready, uploadProgress }) {
                          return (
                            <Button variant="secondary" asChild>
                              <span className="w-full">
                                {
                                ready ? 
                                  <div className="flex items-center gap-2">
                                    { uploadProgress ? <Loader className="h-4 w-4 animate-spin" /> : <FileText className="h-6 w-6 text-muted-foreground" />  }
                                    <p>{form.watch('technicalFileName') ? 'Cambiar PDF' : 'Seleccionar PDF'}</p>
                                  </div> 
                                  : "Cargando..."
                                }
                              </span>
                            </Button>
                          );
                        }
                      }}
                      onClientUploadComplete={(res) => {
                        if (res?.[0]) {
                          const url = res[0].url
                          const fileName = res[0].name
                          field.onChange(url);
                          form.setValue('technicalFileName', fileName);
                        }
                      }}
                      onUploadError={(error: Error) => {
                        console.error("Error al subir PDF:", error.message);
                        toast({ 
                          title: "Error al subir archivo", 
                          description: error.message, 
                          variant: "destructive" 
                        });
                      }}
                      />
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className={cn("flex items-center justify-end space-x-4 pt-6 border-t", id && "justify-between")}>
            { id && <DeleteWineDialog id={id} description="¿Estás seguro de que deseas eliminar este vino?"/> }
            <div className="flex space-x-4">
              <Button onClick={() => closeDialog && closeDialog()} type="button" variant={"secondary"} className="w-32">Cancelar</Button>
              <Button type="submit" className="w-32 ml-2" disabled={!isDirty}>
                {loading ? <Loader className="h-4 w-4 animate-spin" /> : <p>Guardar</p>}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>     
  )
}

type DeleteProps= {
  id: string
  closeDialog: () => void
}

export function DeleteWineForm({ id, closeDialog }: DeleteProps) {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!id) return
    setLoading(true)
    deleteWineAction(id)
    .then(() => {
      toast({title: "Vino eliminado" })
    })
    .catch((error) => {
      toast({title: "Error", description: error.message, variant: "destructive"})
    })
    .finally(() => {
      setLoading(false)
      closeDialog && closeDialog()
    })
  }
  
  return (
    <div className="flex justify-end space-x-4 pt-6 border-t">
      <Button onClick={() => closeDialog && closeDialog()} type="button" variant={"secondary"} className="w-32">Cancelar</Button>
      <Button onClick={handleDelete} variant="destructive" className="w-32 gap-1">
        { loading && <Loader className="h-4 w-4 animate-spin" /> }
        Eliminar  
      </Button>
    </div>
  )
}
