"use client"

import WidgetHeader from "@/modules/widget/ui/components/widget-header";
import {Button} from "@workspace/ui/components/button";
import {ArrowLeftIcon, MenuIcon} from "lucide-react";
import {useAtom, useAtomValue, useSetAtom} from "jotai";
import {
  contactSessionIdAtomFamily,
  conversationIdAtom,
  organizationIdAtom,
  screenAtom
} from "@/modules/widget/atoms/widget-atoms";
import {useQuery} from "convex/react";
import {api} from "@workspace/backend/convex/_generated/api";

export default function WidgetChatScreen() {
  const [conversationId, setConversationId] = useAtom(conversationIdAtom)
  const [organizationId, setOrganizationId] = useAtom(organizationIdAtom)
  const contactSessionId = useAtomValue(contactSessionIdAtomFamily(organizationId || ""))
  const setScreen = useSetAtom(screenAtom)

  const conversation = useQuery(
    api.public.conversations.getOne,
    conversationId &&  contactSessionId ?
      {
        conversationId,
        contactSessionId
      } : "skip"
  )

  const onBack = () => {
    setConversationId(null)
    setScreen("selection")
  }

  return (
    <>
      <WidgetHeader className={"flex items-center justify-between"}>
        <div className={"flex items-center gapx-x-2"}>
          <Button onClick={onBack} size={"icon"} variant={"transparent"}>
            <ArrowLeftIcon/>
          </Button>
          <p>Chat</p>
        </div>
        <Button size={"icon"} variant={"transparent"}>
          <MenuIcon/>
        </Button>
      </WidgetHeader>
      <div className={"flex flex-1 flex-col gap-y-4 p-4"}>
        <p className={"text-sm"}>
          {JSON.stringify(conversation, null, 2)}
        </p>
      </div>
    </>
  )
}
