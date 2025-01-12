import { SidebarComponent } from "@/components/layout/sidebar-component"
import { SidebarProvider } from "@/components/ui/sidebar"
import { auth } from "@/lib/auth"
import { Role } from "@prisma/client"
import { redirect } from "next/navigation"
import { adminMenu } from "./admin-menu"
import { getCurrentUser } from "@/lib/utils"
import { NotAlowed } from "@/components/not-alowed"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {

  const user= await getCurrentUser()

  if (!user) {
    return redirect("/login")
  }

  if (user.role !== Role.SUPER_ADMIN) {
    return <NotAlowed message="No tienes permisos para acceder a esta sección" />
  }

  return (
    <div className="w-full h-full">
      <SidebarProvider className="h-full flex">
        <div className="flex h-full w-full">
          <div className="md:w-[16rem]">
            <SidebarComponent menuGroups={adminMenu} />
          </div>
          
          <main className="p-2 w-full flex-1 overflow-auto mt-10 md:mt-0">
            {children}
          </main>
        </div>
      </SidebarProvider>
    </div>
  )
}
