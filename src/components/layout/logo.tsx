"use client"

import { useTheme } from "next-themes"
import Image from "next/image"
import { useEffect, useState } from "react"

const text1= "RC"
const text2= "Starter"
const image= true

export function Logo() {
    const { theme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    // Evitar el flash durante la hidratación
    if (!mounted) {
        return (
            <div className="relative h-14 w-52">
                <div className="animate-pulse bg-muted h-full w-full rounded" />
            </div>
        )
    }

    const logoImage = theme === "dark" ? "/logo-for-dark.png" : "/logo-for-light.png"

    return (
        <>
        {image ? (
            <div className="relative h-14 w-52">
                <Image 
                    src={logoImage} 
                    alt="Logo" 
                    fill
                    priority
                    sizes="208px"
                    className="object-contain"
                />
            </div>
        ) : (
            <div className="flex items-center">
                <span className="text-foreground">{text1}</span>
                <span className="text-muted-foreground">{text2}</span>
            </div>
        )}
        </>
    )
} 