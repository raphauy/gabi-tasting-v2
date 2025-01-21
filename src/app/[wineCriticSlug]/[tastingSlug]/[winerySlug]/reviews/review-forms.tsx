"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "@/hooks/use-toast"
import { useEffect, useState } from "react"
import { deleteReviewAction, createOrUpdateReviewAction, getReviewDAOAction } from "./review-actions"
import { ReviewSchema, ReviewFormValues } from '@/services/review-services'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Loader } from "lucide-react"




type Props = {
  id?: string
  closeDialog: () => void
}

export function ReviewForm({ id, closeDialog }: Props) {
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(ReviewSchema),
    defaultValues: {
      intensity: "",
      colour: "",
      aromaIntensity: "",
      aromaPrimary: "",
      aromaSecondary: "",
      aromaTertiary: "",
      sweetness: "",
      acidity: "",
      alcohol: "",
      body: "",
      flavourIntensity: "",
      flavourCharacteristics: "",
      score: 0,
      comments: ""
    },
    mode: "onChange",
  })
  const [loading, setLoading] = useState(false)


  const onSubmit = async (data: ReviewFormValues) => {
    setLoading(true)
    try {
      await createOrUpdateReviewAction(id ? id : null, data)
      toast({ title: id ? "Review updated" : "Review created" })
      closeDialog()
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      getReviewDAOAction(id).then((data) => {
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
            name="intensity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Intensity</FormLabel>
                <FormControl>
                  <Input placeholder="Review's intensity" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="colour"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Colour</FormLabel>
                <FormControl>
                  <Input placeholder="Review's colour" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="aromaIntensity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>AromaIntensity</FormLabel>
                <FormControl>
                  <Input placeholder="Review's aromaIntensity" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="aromaPrimary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>AromaPrimary</FormLabel>
                <FormControl>
                  <Input placeholder="Review's aromaPrimary" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="aromaSecondary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>AromaSecondary</FormLabel>
                <FormControl>
                  <Input placeholder="Review's aromaSecondary" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="aromaTertiary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>AromaTertiary</FormLabel>
                <FormControl>
                  <Input placeholder="Review's aromaTertiary" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sweetness"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sweetness</FormLabel>
                <FormControl>
                  <Input placeholder="Review's sweetness" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="acidity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Acidity</FormLabel>
                <FormControl>
                  <Input placeholder="Review's acidity" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="alcohol"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alcohol</FormLabel>
                <FormControl>
                  <Input placeholder="Review's alcohol" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="body"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Body</FormLabel>
                <FormControl>
                  <Input placeholder="Review's body" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="flavourIntensity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>FlavourIntensity</FormLabel>
                <FormControl>
                  <Input placeholder="Review's flavourIntensity" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="flavourCharacteristics"
            render={({ field }) => (
              <FormItem>
                <FormLabel>FlavourCharacteristics</FormLabel>
                <FormControl>
                  <Input placeholder="Review's flavourCharacteristics" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="score"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Score</FormLabel>
                <FormControl>
                  <Input placeholder="Review's score" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="comments"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Comments</FormLabel>
                <FormControl>
                  <Input placeholder="Review's comments" {...field} />
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

export function DeleteReviewForm({ id, closeDialog }: DeleteProps) {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!id) return
    setLoading(true)
    deleteReviewAction(id)
    .then(() => {
      toast({title: "Review deleted" })
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
