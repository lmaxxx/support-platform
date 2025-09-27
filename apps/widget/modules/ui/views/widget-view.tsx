"use client"


import WidgetFooter from "@/modules/ui/components/widget-footer";

type Props = {
  organizationId: string;
}

import React from 'react'
import WidgetHeader from "@/modules/ui/components/widget-header";

export default function WidgetView({organizationId}: Props) {
  return (
    <main className={"flex min-h-screen h-full w-full flex-col overflow-hidden rounded-xl border bg-muted"}>
      <WidgetHeader>
        <div className={"flex flex-col justify-between gap-y-2 px-2 py-6"}>
          <p className={"text-3xl"}>
            Hi there! 👋
          </p>
          <p className={"text-lg"}>
            How can we help you today?
          </p>
        </div>
      </WidgetHeader>
      <div className={"flex flex-1"}>
        hello
      </div>
      <WidgetFooter/>
    </main>
  )
}
