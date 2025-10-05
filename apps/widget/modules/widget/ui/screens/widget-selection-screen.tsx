"use client"

import WidgetHeader from "@/modules/widget/ui/components/widget-header";
import {
  contactSessionIdAtomFamily, conversationIdAtom,
  errorMessageAtom,
  organizationIdAtom,
  screenAtom
} from "@/modules/widget/atoms/widget-atoms";
import {useAtomValue, useSetAtom} from "jotai";
import {ChevronRightIcon, TextIcon} from "lucide-react";
import {Button} from "@workspace/ui/components/button";
import {useMutation} from "convex/react";
import {api} from "@workspace/backend/convex/_generated/api";
import {useState} from "react";
import WidgetFooter from "@/modules/widget/ui/components/widget-footer";

export default function WidgetSelectionScreen() {
  const setScreen = useSetAtom(screenAtom);
  const setErrorMessage = useSetAtom(errorMessageAtom);
  const setConversationId = useSetAtom(conversationIdAtom);
  const organizationId = useAtomValue(organizationIdAtom);
  const contactSessionId = useAtomValue(contactSessionIdAtomFamily(organizationId || ""));
  const [isPending, setIsPending] = useState(false);

  const createConversation = useMutation(api.public.conversations.create)

  const handleNewConversation = async () => {
    if(!organizationId) {
      setScreen("error");
      setErrorMessage("Missing organization ID");
      return;
    }

    if(!contactSessionId) {
      setScreen("auth");
      return;
    }

    try {
      setIsPending(true);

      const conversationId = await createConversation({
        contactSessionId, organizationId
      })

      setConversationId(conversationId)
      setScreen("chat");
    } catch {
      setScreen("auth");
    } finally {
      setIsPending(false);
    }
  }

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
      <div className={"flex flex-1 flex-col gap-y-4 p-4 overflow-y-auto"}>
        <Button
          className={"h-16 w-ful justify-between"}
          variant={"outline"}
          onClick={handleNewConversation}
          disabled={isPending}
        >
          <div className={"flex items-center gap-x-2"}>
            <TextIcon className={"size-4"}/>
            <span>Start chat</span>
          </div>
          <ChevronRightIcon/>
        </Button>
      </div>
      <WidgetFooter/>
    </>
  )
}
