import { SidebarSkeleton } from "@/components/layout/sidebar-component"
import { NotAlowed } from "@/components/not-alowed"
import { SidebarProvider } from "@/components/ui/sidebar"
import { getCurrentUser } from "@/lib/utils"
import { getWineryDAOBySlug } from "@/services/winery-services"
import { Role } from "@prisma/client"
import { notFound, redirect } from "next/navigation"
import { Suspense } from "react"
import { WinerySidebar } from "./winery-sidebar"
type Props = {
  children: React.ReactNode
  params: Promise<{ winerySlug: string }>
}

export default async function WineryLayout({ children, params }: Props) {

  const { winerySlug }= await params
  const user= await getCurrentUser()

  if (!user) {
    return redirect("/login")
  }

  const winery= await getWineryDAOBySlug(winerySlug)
  console.log("Checking winery on layout", winerySlug)
  if (!winery) {
    return notFound()
  }

  const userWinecriticSlug= user.wineCriticSlug
  const userWinerySlug= user.winerySlug

  if (user.role === Role.WINERY) {
    if (userWinerySlug !== winery.slug) {
      const message = `El usuario de bodega (${userWinerySlug}) solo puede acceder a su propia bodega`
      console.log(message)
      return <NotAlowed message={message}/>
    }
  }

  if (user.role === Role.TASTER || user.role === Role.ADMIN) {
    if (userWinecriticSlug !== winery.wineCritic.slug) {
      const message = `El catador solo puede acceder a bodegas del crítico ${userWinecriticSlug}`
      console.log(message)
      return <NotAlowed message={message}/>
    }
  }

  return (
    <div className="w-full h-full">
      <SidebarProvider className="h-full flex">
        <div className="flex h-full w-full">
          <Suspense fallback={<SidebarSkeleton />}>
            <WinerySidebar winerySlug={winerySlug} />
          </Suspense>
          
          <main className="p-2 w-full flex-1 overflow-auto mt-10 md:mt-0">
            {children}
          </main>
        </div>
      </SidebarProvider>
    </div>
  )
}
