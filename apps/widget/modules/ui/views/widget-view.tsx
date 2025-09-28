"use client"


// import WidgetFooter from "@/modules/ui/components/widget-footer";

type Props = {
  organizationId: string;
}

import React from 'react'
import WidgetHeader from "@/modules/ui/components/widget-header";
import WidgetAuthScreen from "@/modules/ui/screens/widget-auth-screen";

export default function WidgetView({organizationId}: Props) {
  return (
    <main className={"flex min-h-screen h-full w-full flex-col overflow-hidden rounded-xl border bg-muted"}>
      <WidgetAuthScreen/>
      {/*<WidgetFooter/>*/}
    </main>
  )
}
