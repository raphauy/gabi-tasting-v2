"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import { es } from "date-fns/locale"

type Props = {
  date: Date | undefined
  setDate: (date: Date) => void
  label: string
}
export function DatePicker({ date, setDate, label }: Props) {

    function handleDateChange(date: Date | undefined) {
        if (date) {
            setDate(date)
        }
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    role="button"
                    variant={"outline"}
                    className={cn(
                        "w-[250px] justify-start text-left font-normal",
                        date && "text-black dark:text-white"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP", {locale: es}) : <span>{label}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar                
                mode="single"
                selected={date}
                onSelect={handleDateChange}
                initialFocus
                locale={es}
                />
            </PopoverContent>
        </Popover>
    )
}
