import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/utils";
import Link from "next/link";
import { logoutAction } from "./(auth)/login/actions";
import { LogoutButtonForButton } from "@/components/layout/logout-button";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getCurrentUser()

  const userRole = user?.role

  if (userRole === Role.SUPER_ADMIN) {
    redirect('/admin')
  }

  if (user?.wineCriticSlug && (userRole === Role.ADMIN || userRole === Role.TASTER)) {
    redirect(`/${user.wineCriticSlug}`)
  }

  if (user?.winerySlug && userRole === Role.WINERY) {
    redirect(`/winery/${user.winerySlug}`)
  }

  return (
      <main className="mt-10 lg:mt-40 w-full flex justify-center">
      {
          user ? (
            <div className="space-y-10">
              <h1>Bienvenido, {user.name || user.email}</h1>
              <p>Rol: {user.role}</p>
              { (user.role === Role.ADMIN || user.role === Role.TASTER) && <p>WineCriticSlug: {user.wineCriticSlug}</p> }
              { (user.role === Role.WINERY) && <p>WinerySlug: {user.winerySlug}</p> }

              <div>
              {user.role === Role.SUPER_ADMIN && (
                <Link href="/admin">
                  <Button className="w-full">Admin</Button>
                </Link>
              )}
              </div>
              <LogoutButtonForButton redirectTo="/" label="Cerrar sesión" />
            </div>
          ) : (
            <Link href="/login">
              <Button>Login</Button>
            </Link>
          )
        }


      </main>
  );
}
