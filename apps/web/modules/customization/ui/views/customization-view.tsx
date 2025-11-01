"use client"

import {useQuery} from "convex/react";
import {api} from "@workspace/backend/convex/_generated/api";
import {Loader2Icon} from "lucide-react";
import React from "react";
import CustomizationForm from "@/modules/customization/ui/components/customization-form";

export default function CustomizationView() {
  const widgetSettings = useQuery(api.private.widgetSettings.getOne);
  const vapiPlugin = useQuery(api.private.plugins.getOne, {
    service: "vapi"
  });

  const isLoading = widgetSettings === undefined || vapiPlugin === undefined

  if(isLoading) {
    return (
      <div className={"min-h-screen flex flex-col items-center justify-center gap-y-2 bg-muted p-8"}>
        <Loader2Icon className={"text-muted-foreground animate-spin"} />
        <p className={"text-muted-foreground text-sm"}>Loading settings...</p>
      </div>
    )
  }

  return (
    <div className={"flex min-h-screen flex-col bg-muted p-8"}>
      <div className={"max-w-screen-md mx-auto w-full"}>
        <div className={"space-y-2"}>
          <h1 className={"text-2xl md:text-4xl"}>Widget Customization</h1>
          <p className={"text-muted-foreground"}>Customize how your chat widget looks and behaves for you customers</p>
        </div>
        <div className={"mt-8"}>
          <CustomizationForm
            initialData={widgetSettings}
            hasVapiPlugin={!!vapiPlugin}
          />
        </div>
      </div>
    </div>
  )
}
