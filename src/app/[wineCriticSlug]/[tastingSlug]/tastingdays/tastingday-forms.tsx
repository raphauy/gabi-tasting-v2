"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "@/hooks/use-toast"
import { useEffect, useState } from "react"
import { deleteTastingDayAction, createOrUpdateTastingDayAction, getTastingDayDAOAction } from "./tastingday-actions"
import { TastingDaySchema, TastingDayFormValues } from '@/services/tastingday-services'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Loader } from "lucide-react"
import { DatePicker } from "@/components/date-picker"



type Props = {
  id?: string
  tastingId: string
  closeDialog: () => void
}

export function TastingDayForm({ id, tastingId, closeDialog }: Props) {
  const form = useForm<TastingDayFormValues>({
    resolver: zodResolver(TastingDaySchema),
    defaultValues: {
      date: new Date(),
      tastingId
    },
    mode: "onChange",
  })
  const [loading, setLoading] = useState(false)


  const onSubmit = async (data: TastingDayFormValues) => {
    setLoading(true)
    try {
      await createOrUpdateTastingDayAction(id ? id : null, data)
      toast({ title: id ? "TastingDay actualizado" : "TastingDay creado" })
      closeDialog()
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      getTastingDayDAOAction(id).then((data) => {
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
            name="date"
            render={({ field }) => (
              <FormItem className="flex justify-center min-h-80 mt-2">
                <FormControl>
                  <DatePicker date={field.value || undefined} setDate={field.onChange} label="Fecha del tasting day" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button onClick={() => closeDialog()} type="button" variant={"secondary"} className="w-32">Cancelar</Button>
            <Button type="submit" className="w-32 ml-2">
              {loading ? <Loader className="h-4 w-4 animate-spin" /> : <p>Guardar</p>}
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

export function DeleteTastingDayForm({ id, closeDialog }: DeleteProps) {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!id) return
    setLoading(true)
    deleteTastingDayAction(id)
    .then(() => {
      toast({title: "TastingDay deleted" })
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
