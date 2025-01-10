"use client"

import { Menubar, MenubarContent, MenubarMenu, MenubarSeparator, MenubarTrigger } from "@/components/ui/menubar";
import { cn } from "@/lib/utils";
import { EllipsisVertical } from "lucide-react";
import { useState } from "react";
import { DeleteTastingDayDialog, TastingDayDialog } from "./tastingdays/tastingday-dialogs";

type Props = {
    tastingId: string
    tastingDayId: string
    tastingDayDateStr: string
}

export default function TastingDayMenu({ tastingId, tastingDayId, tastingDayDateStr }: Props) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleDialogOpen = () => {
        setIsDialogOpen(true);
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
    };

    return (
        <Menubar className="border-0 bg-background">
            <MenubarMenu>
                <MenubarTrigger className="px-1 cursor-pointer bg-background" onClick={handleDialogClose}>
                    <EllipsisVertical className="h-5 w-5" />
                </MenubarTrigger>
                <MenubarContent className={cn("p-4 text-muted-foreground", isDialogOpen && "hidden")}>
                    <div onClick={handleDialogOpen}>
                        <TastingDayDialog tastingId={tastingId} id={tastingDayId} />
                    </div>
                    <MenubarSeparator />
                    <div onClick={handleDialogOpen}>
                        <DeleteTastingDayDialog id={tastingDayId} description={`Seguro que quieres eliminar el tasting day del día ${tastingDayDateStr}?`} />
                    </div>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    );
}
