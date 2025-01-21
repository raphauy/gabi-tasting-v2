import { SidebarSkeleton } from "@/components/layout/sidebar-component"
import { NotAlowed } from "@/components/not-alowed"
import { SidebarProvider } from "@/components/ui/sidebar"
import { getCurrentUser } from "@/lib/utils"
import { Role } from "@prisma/client"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import { WineCriticSidebar } from "./wine-critic-sidebar"

type Props = {
  children: React.ReactNode
  params: Promise<{ wineCriticSlug: string }>
}

export default async function TastingLayout({ children, params }: Props) {

  const { wineCriticSlug }= await params

  const user= await getCurrentUser()

  if (!user) {
    return redirect("/login")
  }

  if (user.role !== Role.SUPER_ADMIN && user.role !== Role.ADMIN && user.role !== Role.TASTER) {
    return <NotAlowed message="No tienes permisos para acceder."/>
  }

  return (
    <div className="w-full h-full">
      <SidebarProvider className="h-full flex">
        <div className="flex h-full w-full">
          <Suspense fallback={<SidebarSkeleton />}>
            <WineCriticSidebar wineCriticSlug={wineCriticSlug} />
          </Suspense>
          
          <main className="p-2 w-full flex-1 overflow-auto mt-10 md:mt-0">
            {children}
          </main>
        </div>
      </SidebarProvider>
    </div>
  )
}
