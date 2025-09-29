"use client"

import WidgetHeader from "@/modules/widget/ui/components/widget-header";
import {errorMessageAtom} from "@/modules/widget/atoms/widget-atoms";
import {useAtomValue} from "jotai";
import {AlertTriangleIcon} from "lucide-react";

export default function WidgetErrorScreen() {
  const errorMessage = useAtomValue(errorMessageAtom);

  return (
    <>
      <WidgetHeader>
        <div className={"flex flex-col justify-between gap-y-2 px-2 py-6"}>
          <p className={"text-3xl"}>
            Hi there! 👋
          </p>
          <p className={"text-lg"}>
            Let&apos;s get you started
          </p>
        </div>
      </WidgetHeader>
      <div className={"flex flex-1 items-center justify-center flex-col gap-y-4 p-4 text-muted-foreground"}>
        <AlertTriangleIcon/>
        <p className={"text-sm"}>
          {errorMessage || "Invalid configuration"}
        </p>
      </div>
    </>
  )
}
