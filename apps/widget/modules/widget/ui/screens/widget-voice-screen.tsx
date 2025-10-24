import React from 'react'
import {useAtomValue, useSetAtom} from "jotai";
import {screenAtom, vapiSecretsAtom, widgetSettingsAtom} from "@/modules/widget/atoms/widget-atoms";
import {useVapi} from "@/modules/widget/hooks/use-vapi";
import WidgetHeader from "@/modules/widget/ui/components/widget-header";
import {Button} from "@workspace/ui/components/button";
import {ArrowLeftIcon, MicIcon} from "lucide-react";
import WidgetFooter from "@/modules/widget/ui/components/widget-footer";
import {cn} from "@workspace/ui/lib/utils";
import {
  AIConversation,
  AIConversationContent,
  AIConversationScrollButton
} from "@workspace/ui/components/ai/conversation";
import {AIMessage, AIMessageContent} from "@workspace/ui/components/ai/message";

export default function WidgetVoiceScreen() {
  const setScreen = useSetAtom(screenAtom)
  const {isConnecting, isSpeaking, transcript, startCall, endCall, isConnected} = useVapi();

  return (
    <>
      <WidgetHeader>
        <div className={"flex items-center gap-x-2"}>
          <Button
            variant={"transparent"}
            size={"icon"}
            onClick={() => setScreen("selection")}
          >
            <ArrowLeftIcon/>
          </Button>
          <p>Voice Chat</p>
        </div>
      </WidgetHeader>
      {
        transcript.length > 0 ? (
          <AIConversation className={"h-full flex-1"}>
            <AIConversationContent>
              {
                transcript.map((message, index) => (
                  <AIMessage
                    from={message.role}
                    key={`${message.role}-${index}-${message.text}`}
                  >
                    <AIMessageContent>{message.text}</AIMessageContent>
                  </AIMessage>
                ))
              }
            </AIConversationContent>
            <AIConversationScrollButton/>
          </AIConversation>
        ) : (
          <div className={"flex h-full flex-1 flex-col items-center justify-center gap-y-4-"}>
            <div className={"flex items-center justify-center rounded-full border bg-white p-3 mb-1"}>
              <MicIcon className={"size-6 text-muted-foreground"}/>
            </div>
            <p className={"text-muted-foreground"}>Transcript will appear here</p>
          </div>
        )
      }

      <div className={"border-t bg-background p-4"}>
        <div className={"flex flex-col items-center gap-y-4"}>
          {
            isConnected && (
              <div className={"flex items-center gap-x-2"}>
                <div className={cn(
                  "size-3 rounded-full",
                  isSpeaking ? "animate-pulse bg-red-500" : "bg-green-500"
                )}/>
                <span className={"text-muted-foreground text-sm"}>
              {isSpeaking ? "Assistant Speaking..." : "Listening..."}
            </span>
              </div>
            )
          }
          <div className={"flex w-full justify-center"}>
            {
              isConnected ? (
                <Button
                  className={"w-full"}
                  disabled={isConnecting}
                  size={"lg"}
                  variant={"destructive"}
                  onClick={() => endCall()}
                >
                  End Call
                </Button>
              ) : (
                <Button
                  className={"w-full"}
                  disabled={isConnecting}
                  size={"lg"}
                  onClick={() => startCall()}
                >
                  Start Call
                </Button>
              )

            }
          </div>
        </div>
      </div>
    </>
  )
}
