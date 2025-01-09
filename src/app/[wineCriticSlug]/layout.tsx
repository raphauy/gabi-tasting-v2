import { SidebarComponent } from "@/components/layout/sidebar-component"
import { SidebarProvider } from "@/components/ui/sidebar"
import { auth } from "@/lib/auth"
import { Role } from "@prisma/client"
import { notFound, redirect } from "next/navigation"

type Props = {
  children: React.ReactNode
  params: Promise<{ wineCriticSlug: string }>
}

export default async function TastingLayout({ children, params }: Props) {

  const { wineCriticSlug }= await params

  const session= await auth()

  if (!session) {
    return redirect("/login")
  }

  if (session.user.role !== Role.SUPER_ADMIN && session.user.role !== Role.ADMIN && session.user.role !== Role.TASTER) {
    return notFound()
  }

  return (
    <div className="w-full h-full">
      <SidebarProvider className="h-full flex">
        <div className="flex h-full w-full">
          <div className="md:w-[16rem]">
            <SidebarComponent wineCriticSlug={wineCriticSlug} />
          </div>
          
          <main className="p-2 w-full flex-1 overflow-auto mt-10 md:mt-0">
            {children}
          </main>
        </div>
      </SidebarProvider>
    </div>
  )
}
