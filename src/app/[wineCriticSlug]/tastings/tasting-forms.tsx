"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "@/hooks/use-toast"
import { useEffect, useState } from "react"
import { deleteTastingAction, createOrUpdateTastingAction, getTastingDAOAction } from "./tasting-actions"
import { TastingSchema, TastingFormValues } from '@/services/tasting-services'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Loader } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { generateSlug } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"

type Props = {
  id?: string
  wineCriticId: string
  closeDialog: () => void
}

export function TastingForm({ id, wineCriticId, closeDialog }: Props) {
  const form = useForm<TastingFormValues>({
    resolver: zodResolver(TastingSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      wineCriticId
    },
    mode: "onChange",
  })
  const [loading, setLoading] = useState(false)

  const [autoGenerateSlug, setAutoGenerateSlug] = useState(!id) // true para nuevo, false para edición

  // Efecto para generar el slug automáticamente cuando cambia el nombre
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'name' && autoGenerateSlug) {
        form.setValue('slug', generateSlug(value.name || ''))
      }
    });
    return () => subscription.unsubscribe();
  }, [form, autoGenerateSlug]);

  // Generar slug cuando se activa autoGenerateSlug
  useEffect(() => {
    if (autoGenerateSlug) {
      form.setValue('slug', generateSlug(form.getValues('name')))
    }
  }, [autoGenerateSlug, form])

  const onSubmit = async (data: TastingFormValues) => {
    setLoading(true)
    try {
      await createOrUpdateTastingAction(id ? id : null, data)
      toast({ title: id ? "Tasting updated" : "Tasting created" })
      closeDialog()
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      getTastingDAOAction(id).then((data) => {
        if (data) {
          form.reset(data)
        }
        Object.keys(form.getValues()).forEach((key: any) => {
          if (form.getValues(key) === null) {
            form.setValue(key, "")
          }
        })
      })
    }
  }, [form, id])

  return (
    <div className="rounded-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Tasting's name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-row items-center justify-between" >
                  <FormLabel>Slug</FormLabel>
                  <div className="flex flex-row items-center gap-2">
                    <p>Auto</p>
                    <Switch                    
                      checked={autoGenerateSlug}
                      onCheckedChange={setAutoGenerateSlug}
                    />
                  </div>
                </div>
                <FormControl>
                  <Input 
                    placeholder="Tasting's slug" 
                    {...field} 
                    disabled={autoGenerateSlug}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea rows={6} placeholder="Tasting's description" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button onClick={() => closeDialog()} type="button" variant={"secondary"} className="w-32">Cancel</Button>
            <Button type="submit" className="w-32 ml-2">
              {loading ? <Loader className="h-4 w-4 animate-spin" /> : <p>Save</p>}
            </Button>
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

export function DeleteTastingForm({ id, closeDialog }: DeleteProps) {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!id) return
    setLoading(true)
    deleteTastingAction(id)
    .then(() => {
      toast({title: "Tasting deleted" })
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
    <div>
      <Button onClick={() => closeDialog && closeDialog()} type="button" variant={"secondary"} className="w-32">Cancel</Button>
      <Button onClick={handleDelete} variant="destructive" className="w-32 ml-2 gap-1">
        { loading && <Loader className="h-4 w-4 animate-spin" /> }
        Delete  
      </Button>
    </div>
  )
}
