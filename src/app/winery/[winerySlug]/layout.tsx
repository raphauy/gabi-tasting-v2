import { SidebarSkeleton } from "@/components/layout/sidebar-component"
import { SidebarProvider } from "@/components/ui/sidebar"
import { auth } from "@/lib/auth"
import { Role } from "@prisma/client"
import { notFound, redirect } from "next/navigation"
import { Suspense } from "react"
import { WinerySidebar } from "./winery-sidebar"
import { getWineryDAOBySlug } from "@/services/winery-services"
import { log } from "console"
import { NotAlowed } from "@/components/not-alowed"
type Props = {
  children: React.ReactNode
  params: Promise<{ winerySlug: string }>
}

export default async function WineryLayout({ children, params }: Props) {

  const { winerySlug }= await params
  const session= await auth()

  if (!session) {
    return redirect("/login")
  }

  const winery= await getWineryDAOBySlug(winerySlug)
  console.log("Checking winery on layout", winerySlug)
  if (!winery) {
    return notFound()
  }

  const user= session.user
  const userWinecriticSlug= user.wineCriticSlug

  if (user.role === Role.WINERY || user.role === Role.ADMIN || user.role === Role.TASTER) {
    if (userWinecriticSlug !== winery.wineCritic.slug) {
      const message= `El crítico asociado al usuario (${userWinecriticSlug}) no coincide con el crítico asociado a la Bodega (${winery.wineCritic.slug})`
      console.log(message)
      return <NotAlowed message={message}/>
    }
  }

  return (
    <div className="w-full h-full">
      <SidebarProvider className="h-full flex">
        <div className="flex h-full w-full">
          <div className="md:w-[16rem]">
            <Suspense fallback={<SidebarSkeleton />}>
              <WinerySidebar winerySlug={winerySlug} />
            </Suspense>
          </div>
          
          <main className="p-2 w-full flex-1 overflow-auto mt-10 md:mt-0">
            {children}
          </main>
        </div>
      </SidebarProvider>
    </div>
  )
}
