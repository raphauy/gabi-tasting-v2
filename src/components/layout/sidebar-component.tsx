"use client"

import { Button } from "@/components/ui/button"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuAction, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem, SidebarMenuSkeleton, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { MenuGroup, MenuItem } from "@/lib/utils"
import { ChevronRight, Menu } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Skeleton } from "../ui/skeleton"

type Props = {  
  menuGroups: MenuGroup[]
  side?: "left" | "right"
}

export function SidebarComponent({ menuGroups, side = "left" }: Props) {
  const pathname = usePathname()
  const { isMobile, setOpenMobile } = useSidebar()

  const handleMenuClick = () => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed left-4 z-40 top-[4rem] mt-1"
        onClick={() => setOpenMobile(true)}
      >
        <Menu />
      </Button>
      <Sidebar side={side} variant="floating" collapsible="icon" className="top-[4rem] h-[calc(100svh-4rem)]">
        <SidebarHeader className="h-8 flex items-end mr-0.5">
          <SidebarTrigger />
        </SidebarHeader>
        <SidebarContent className="block">
          {
            menuGroups.map((group) => (
              <SidebarGroup key={group.name}>
                <SidebarGroupLabel>{group.name}</SidebarGroupLabel>
                <SidebarGroupContent>
                  {getMenuItems(group.items, pathname, handleMenuClick)}
                </SidebarGroupContent>
              </SidebarGroup>
            ))
          }
        </SidebarContent>
      </Sidebar>
    </>
  )
} 

function getMenuItems(menuItems: MenuItem[], pathname: string, onMenuClick: () => void) {
  return (
    <SidebarMenu>
    {menuItems.map((item) => (
      <SidebarMenuItem key={item.name}>
          <SidebarMenuButton
            asChild
            isActive={pathname === item.href}
            tooltip={item.name}
            onClick={onMenuClick}
          >
            {item.href ? 
            <Link href={item.href} prefetch={false} className="flex items-center justify-between w-full">
              <div className="flex items-center min-w-0 gap-2">
                {item.icon}
                <span className="truncate">{item.name}</span>
              </div>
              {item.opositeIcon && (
                <div>
                  {item.opositeIcon}
                </div>
              )}
            </Link> : 
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center min-w-0 gap-2">
                {item.icon}
                <span className="truncate">{item.name}</span>
              </div>
              {item.opositeIcon && (
                <div>
                  {item.opositeIcon}
                </div>
              )}
            </div>}
          </SidebarMenuButton>
          {item.subItems && item.subItems.length > 0 && (
            <SidebarMenuSub>
              {item.subItems.map((subItem) => (
                <SidebarMenuSubItem key={subItem.href} className="pr-0">
                  <SidebarMenuSubButton
                    asChild
                    isActive={pathname === subItem.href}
                    onClick={onMenuClick}
                 >
                    {subItem.href ? 
                    <Link href={subItem.href} className="flex items-center justify-between w-full">
                      <div className="flex items-center min-w-0">
                        <div>{subItem.icon}</div>
                        <span className="truncate">{subItem.label}</span>
                      </div>
                      {subItem.opositeIcon && (
                        <div>
                          {subItem.opositeIcon}
                        </div>
                      )}
                    </Link> : 
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center min-w-0">
                        {subItem.icon}
                        <span className="truncate">{subItem.label}</span>
                      </div>
                      {subItem.opositeIcon && (
                        <div>
                          {subItem.opositeIcon}
                        </div>
                      )}
                    </div>}
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          )}
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}

export function SidebarSkeleton() {
  return (
    <div className="h-[calc(100svh-84px)] w-[16rem]">
      <div className="rounded-xl bg-gray-50 border mr-4 h-full">
        <SidebarHeader className="flex items-end mr-0.5">
          <Skeleton className="h-6 w-6" />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>
              <Skeleton className="h-4 w-24" />
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuSkeleton className="w-[80%]" showIcon />
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuSkeleton className="w-[75%]" showIcon />
                </SidebarMenuItem>
                <SidebarMenuItem className="ml-4">
                  <SidebarMenuSkeleton className="w-[70%]" />
                </SidebarMenuItem>
                <SidebarMenuItem className="ml-4">
                  <SidebarMenuSkeleton className="w-[65%]" />
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuSkeleton className="w-[85%]" showIcon />
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuSkeleton className="w-[70%]" showIcon />
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup className="mt-4">
            <SidebarGroupLabel>
              <Skeleton className="h-4 w-20" />
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuSkeleton className="w-[75%]" showIcon />
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </div>
    </div>
  )
}