import { SidebarComponent } from "@/components/layout/sidebar-component"
import { SidebarProvider } from "@/components/ui/sidebar"
import { auth } from "@/lib/auth"
import { Role } from "@prisma/client"
import { redirect } from "next/navigation"
import { adminMenu } from "./admin-menu"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {

  const session= await auth()

  if (!session) {
    return redirect("/login")
  }

  if (session.user.role !== Role.SUPER_ADMIN) {
    return redirect("/")
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
