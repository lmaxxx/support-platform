"use client"


// import WidgetFooter from "@/modules/ui/components/widget-footer";

import {useAtomValue} from "jotai";
import React from 'react'
import WidgetHeader from "@/modules/widget/ui/components/widget-header";
import WidgetAuthScreen from "@/modules/widget/ui/screens/widget-auth-screen";
import {screenAtom} from "@/modules/widget/atoms/widget-atoms";

type Props = {
  organizationId: string;
}

export default function WidgetView({organizationId}: Props) {
  const screen = useAtomValue(screenAtom);

  const screenComponents = {
    error: <p>Error</p>,
    loading: <p>loading</p>,
    auth: <p>auth</p>,
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
