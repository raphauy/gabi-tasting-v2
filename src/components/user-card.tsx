'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UserDAO } from "@/services/user-services"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Mail, Calendar, Building2, BookOpenCheck, Glasses } from "lucide-react"

type Props = {
  user: UserDAO
  fullData?: boolean
}

export function UserCard({ user, fullData = true }: Props) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Avatar className="h-16 w-16 border">
            <AvatarImage src={user.image || undefined} alt={user.name || ""} className="object-cover"/>
            <AvatarFallback className="text-lg">
              {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
              <h3 className="font-semibold text-lg truncate">
                {user.name || "Sin nombre"}
              </h3>
              <Badge variant="secondary" className="w-fit">
                {user.role}
              </Badge>
            </div>

            <div className="flex justify-between">
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div><Calendar className="h-4 w-4" /></div>
                  <span suppressHydrationWarning>
                    Actualizado el {format(new Date(user.updatedAt), "d 'de' MMMM, yyyy", { locale: es })}
                  </span>
                </div>
              </div>
              {fullData && (
                <div className="space-y-1 text-sm text-muted-foreground">
                  {user.wineCritic && (
                    <div className="flex items-center gap-2 mt-2">
                      <Glasses className="h-4 w-4" />
                      <span className="truncate">{user.wineCritic.name}</span>
                    </div>
                  )}
                {user.winery && (
                  <div className="flex items-center gap-2 mt-2">
                    <Building2 className="h-4 w-4" />
                    <span className="truncate">{user.winery.name}</span>
                  </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 