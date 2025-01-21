"use client"

import { Button } from "@/components/ui/button"
import { Loader, PlusCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

type Props = {
    href: string
}

export default function CreateReviewButton({ href }: Props) {

    const [loading, setLoading] = useState(false)

    const router = useRouter()

    async function handleClick() {
        setLoading(true)
        // sleep for 1 second
        await new Promise(resolve => setTimeout(resolve, 2000))
        router.push(href)
        setLoading(false)
    }

    return (
        <Button onClick={handleClick} disabled={loading}>
            {loading ? <Loader className="h-4 w-4 animate-spin" /> : <PlusCircle className="h-4 w-4" />}
            <p>Crear review</p>
        </Button>
    )
}