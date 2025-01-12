"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "@/hooks/use-toast"
import { useEffect, useState } from "react"
import { deleteWineAction, createOrUpdateWineAction, getWineDAOAction } from "./wine-actions"
import { WineSchema, WineFormValues } from '@/services/wine-services'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader } from "lucide-react"
import { WineStyle } from "@prisma/client"
import { useRouter } from "next/navigation"
import { DeleteWineDialog } from "./wine-dialogs"

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
      region: "",
      abv: "",
      price: "",
      wineryId,
      tastingId
    },
    mode: "onChange",
  })
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
                    <Input placeholder="Graduación del vino" {...field} />
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
                  <FormControl>
                    <Input placeholder="Precio del vino" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex items-center justify-between space-x-4 pt-6 border-t">
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
