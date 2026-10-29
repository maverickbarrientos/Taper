'use client'

import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ChartLineUpIcon, UsersThreeIcon, CalendarDotsIcon, TargetIcon, UserCircleIcon, type Icon } from "@phosphor-icons/react"
import { Sidebar, SidebarHeader, SidebarFooter, SidebarGroup, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"
import LogoutButton from "@/components/logout-button"
import logo from "@/public/taper-logo.png"

const sidebarLinks: { label: string, href: string, Icon: Icon }[] = [
  { label: "Dashbord", href: "/dashboard", Icon: ChartLineUpIcon },
  { label: "Athletes", href: "/athletes", Icon: UsersThreeIcon },
  { label: "Calendar", href: "/calendar", Icon:  CalendarDotsIcon },
  { label: "Program", href: "/program", Icon: TargetIcon },
  { label: "Profile", href: "/profile", Icon: UserCircleIcon },
]

export default function CoachSidebar() {

  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-3">
          <Image src={logo} alt="Taper Logo" width={50} height={50} />
          <h1 className="text-2xl font-bold">Taper</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {sidebarLinks.map(({ label, href, Icon }) => {
              const isActive = pathname.includes(href)

              return (
                <SidebarMenuItem key={label} className="my-1">
                  <SidebarMenuButton render={<Link href={href} />} isActive={isActive}>
                    <Icon />
                    <p>{label}</p>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )

            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <LogoutButton />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )

}