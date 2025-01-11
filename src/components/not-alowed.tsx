import Link from "next/link"
import { Button } from "@/components/ui/button"

type Props = {
  message: string
}

export function NotAlowed({ message }: Props) {
  return (
    <div className="mt-10 w-full flex flex-col items-center">
        <div className="flex justify-center space-y-10">
            <div className="border rounded-md p-4 space-y-4 text-center">
                <p className="text-2xl font-bold">Advertencia!</p>
                <p className="font-bold">No puedes acceder a esta página</p>
                <p className="text-muted-foreground mt-10">{message}</p>
            </div>
        </div>
        <Link href="/" className="mt-10">
            <Button className="w-32">Inicio</Button>
        </Link>
    </div>
  )
}
