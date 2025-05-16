import * as React from "react"
import {
  // AudioWaveform,
  // BookOpen,
  // Bot,
  // Command,
  // Frame,
  GalleryVerticalEnd,
  // Map,
  // PieChart,
  // Settings2,
  // SquareTerminal,
  User
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
// import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { store } from "@/stores"



export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const state = store.getState();

  const data = {
    user: {
      name: state.auth.user?.name ?? '',
      email: state.auth.user?.email ?? '',
      avatar: state.auth.user?.image ?? '/avatars/shadcn.jpg/'
    },
    teams: [
      {
        name: "Dashboard",
        logo: GalleryVerticalEnd,
        plan: "Enterprise",
      },
    ],
    navMain: [
      {
        title: "QL Thành viên",
        url: "#",
        icon: User,
        isActive: true,
        items: [
          {
            title: "QL nhóm thành viên",
            url: "/user_catalogues",
          },
          {
            title: "QL thành viên",
            url: "/users",
          },
          {
            title: "QL quyền",
            url: "/permissions",
          },
        ],
      },
      {
        title: "QL  bài viết",
        url: "#",
        icon: User,
        isActive: true,
        items: [
          {
            title: "QL nhóm bài viết",
            url: "/post_catalogues",
          },
          {
            title: "QL bài viết",
            url: "/posts",
          },
        ],
      },
    ],
  }
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />

      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
