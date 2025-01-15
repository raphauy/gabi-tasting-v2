'use client'

import * as React from 'react'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Label } from '@/components/ui/label'
import { Camera, File, Loader } from 'lucide-react'
import { generateReactHelpers } from "@uploadthing/react"
import { OurFileRouter } from '@/app/api/uploadthing/core'
import { useSession } from 'next-auth/react'
import { Button } from './ui/button'
import Link from 'next/link'

const { useUploadThing } = generateReactHelpers<OurFileRouter>()

type Props = {
  label: string
  initialFileUrl: string | null | undefined
  onUpdate: (url: string, fileName: string) => Promise<boolean>
}

export function FileField({ label = "Ficha técnica", initialFileUrl, onUpdate }: Props) {
  const { update, data } = useSession()
  const { toast } = useToast()
  const [fileUrl, setFileUrl] = React.useState<string | null | undefined>(initialFileUrl)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    setFileUrl(initialFileUrl)
  }, [initialFileUrl])

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: async (res) => {
      if (res?.[0]) {
        const success = await onUpdate(res[0].url, res[0].name)
        if (success) {
          setFileUrl(res[0].url)
          toast({
            title: label,
            description: "Tu archivo se ha actualizado correctamente.",
          })
          update({
            trigger: "update"
          })
        } else {
          toast({
            variant: "destructive",
            title: label,
            description: "No se pudo actualizar el archivo. Por favor, intenta de nuevo.",
          })
        }
      }
    },
    onUploadError: (error: Error) => {
      toast({
        variant: "destructive",
        title: label,
        description: error.message || "Error al subir la imagen.",
      })
    },
  })

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await startUpload([file])
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="pt-6">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <Label className="text-base font-semibold">
                {label}
              </Label>
              <p className="text-sm text-muted-foreground">
                {fileUrl ? 
                <Link href={fileUrl} target="_blank" className="text-primary underline">
                  <Button variant="link" className="gap-2 px-0" type="button">
                    Ver archivo
                  </Button>
                </Link>
                : 
                "Aún no hay archivo."}
              </p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              accept="application/pdf"
            />
            {
                isUploading && (
                  <div className='h-16 w-16 flex items-center justify-center border rounded-full'>
                    <Loader className="h-6 w-6 text-muted-foreground animate-spin" />
                  </div>
                )
            }
            {
              !isUploading && (            
              <Button onClick={handleClick} variant="outline" className='gap-2' type="button">
                <File className="h-6 w-6 text-muted-foreground" />
                <p>Subir archivo</p>
              </Button>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Haz clic en el botón para subir un archivo para la ficha técnica.
          </p>
        </div>
      </CardContent>
      <CardFooter className="bg-muted py-4 border-t">
        <p className="text-sm text-muted-foreground">
          La ficha técnica es opcional pero recomendado.
        </p>
      </CardFooter>
    </Card>
  )
}

function getFileName(url: string) {
  return url.split('/').pop()
}