import {ReactNode} from 'react'
import {AuthGuard} from "@/modules/auth/ui/components/auth-guard";
import {SidebarProvider} from "@workspace/ui/components/sidebar";
import {cookies} from "next/headers";
import DashboardSidebar from "@/modules/dashboard/ui/components/dashboard-sidebar";
import {Provider} from "jotai";


export default async function DashboardLayout({children}: { children: ReactNode }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  return (
    <AuthGuard>
      <Provider>
        <SidebarProvider defaultOpen={defaultOpen}>
          <DashboardSidebar/>
          <main className={"flex flex-1 flex-col"}>
            {children}
          </main>
        </SidebarProvider>
      </Provider>
    </AuthGuard>
  )
}
