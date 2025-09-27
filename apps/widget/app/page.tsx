"use client"

import {Button} from "@workspace/ui/components/button";
import WidgetView from "@/modules/ui/views/widget-view";
import {use} from "react";

type Props = {
  searchParams: Promise<{
    organizationId: string
  }>
}

export default function Page({searchParams}: Props) {
  const {organizationId} = use(searchParams);

  return (
    <WidgetView organizationId={organizationId}/>
  )
}
