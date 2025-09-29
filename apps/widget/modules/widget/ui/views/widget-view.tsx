"use client"

// import WidgetFooter from "@/modules/ui/components/widget-footer";

import {useAtomValue} from "jotai";
import React from 'react'
import WidgetHeader from "@/modules/widget/ui/components/widget-header";
import WidgetAuthScreen from "@/modules/widget/ui/screens/widget-auth-screen";
import {screenAtom} from "@/modules/widget/atoms/widget-atoms";
import WidgetErrorScreen from "@/modules/widget/ui/screens/widget-error-screen";
import WidgetLoadingScreen from "@/modules/widget/ui/screens/widget-loading-screen";

type Props = {
  organizationId: string | null;
}

export default function WidgetView({organizationId}: Props) {
  const screen = useAtomValue(screenAtom);

  const screenComponents = {
    error: <WidgetErrorScreen/>,
    loading: <WidgetLoadingScreen organizationId={organizationId}/>,
    auth: <WidgetAuthScreen/>,
    voice: <p>voice</p>,
    inbox: <p>inbox</p>,
    selection: <p>selection</p>,
    chat: <p>chat</p>,
    contact: <p>contact</p>,
  }

  return (
    <main className={"flex min-h-screen h-full w-full flex-col overflow-hidden rounded-xl border bg-muted"}>
      {screenComponents[screen]}
      {/*<WidgetAuthScreen/>*/}
      {/*<WidgetFooter/>*/}
    </main>
  )
}
