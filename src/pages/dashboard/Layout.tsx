import { AppSidebar } from "@/components/app-sidebar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Outlet, useOutletContext } from "react-router-dom"
import { DashboardLayoutContext } from "@/interfaces/layout.interface"
import { useState } from "react"
import { ChevronRight } from "lucide-react"


export default function Page() {

    const [heading, setHeading] = useState<string>('');


    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="h-4 mr-2" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="#">
                                        Dashboard
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>{heading}</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <div className="border-t border-b p-[20px]">
                    <div className="text-[20px]  font-light text-gray-700 mb-2 uppercase">
                        {heading}
                    </div>
                    <div className="flex items-center text-[13px] text-gray-500">
                        <span>Dashboard</span>
                        <ChevronRight className="text-[11px]" />
                        <span className="text-gray-700 text-[13px]">
                            {heading}
                        </span>
                    </div>
                </div>
                <Outlet context={{ setHeading }} />
            </SidebarInset>
        </SidebarProvider>
    )
}

export function useDashboard() {
    return useOutletContext<DashboardLayoutContext>()
}
