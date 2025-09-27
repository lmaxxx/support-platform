import {ReactNode} from "react";
import DashboardLayout from "@/modules/dashboard/ui/layouts/dashboard-layout";

export default function Layout({children}: {children: ReactNode}) {
  return (
    <DashboardLayout>{children}</DashboardLayout>
  )
}
