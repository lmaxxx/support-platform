"use client"

import WidgetHeader from "@/modules/widget/ui/components/widget-header";
import {Button} from "@workspace/ui/components/button";
import {ArrowLeftIcon, MenuIcon} from "lucide-react";
import {useAtom, useAtomValue, useSetAtom} from "jotai";
import {
  contactSessionIdAtomFamily,
  conversationIdAtom,
  organizationIdAtom,
  screenAtom, widgetSettingsAtom
} from "@/modules/widget/atoms/widget-atoms";
import {useAction, useQuery} from "convex/react";
import {api} from "@workspace/backend/convex/_generated/api";
import {toUIMessages, useThreadMessages} from "@convex-dev/agent/react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {messageFormSchema, MessageFormValues} from "@workspace/ui/lib/schemas";
import {AIConversation, AIConversationContent} from "@workspace/ui/components/ai/conversation";
import {AIMessage, AIMessageContent} from "@workspace/ui/components/ai/message";
import {AIResponse} from "@workspace/ui/components/ai/response";
import {Form, FormField} from "@workspace/ui/components/form";
import {AIInput, AIInputSubmit, AIInputTextarea, AIInputToolbar, AIInputTools} from "@workspace/ui/components/ai/input";
import useInfiniteScroll from "@workspace/ui/hooks/use-infinite-scroll";
import InfiniteScrollTrigger from "@workspace/ui/components/infinite-scroll-trigger";
import DicebearAvatar from "@workspace/ui/components/dicebear-avatar";
import {useMemo} from "react";
import {AISuggestion, AISuggestions} from "@workspace/ui/components/ai/suggestion";

export default function WidgetChatScreen() {
  const [conversationId, setConversationId] = useAtom(conversationIdAtom)
  const [organizationId, setOrganizationId] = useAtom(organizationIdAtom)
  const contactSessionId = useAtomValue(contactSessionIdAtomFamily(organizationId || ""))
  const setScreen = useSetAtom(screenAtom)
  const widgetSettings = useAtomValue(widgetSettingsAtom)

  const conversation = useQuery(
    api.public.conversations.getOne,
    conversationId &&  contactSessionId ?
      {
        conversationId,
        contactSessionId
      } : "skip"
  )

  const messages = useThreadMessages(
    api.public.messages.getMany,
    conversation?.threadId && contactSessionId ? {
      threadId: conversation.threadId,
      contactSessionId
    } : "skip",
    {initialNumItems: 10}
  )

  const {topElementRef, handleLoadMore, canLoadMore, isLoadingMore} = useInfiniteScroll({
    status: messages.status,
    loadMore: messages.loadMore,
    loadSize: 10
  })

  const form = useForm<MessageFormValues>({
    resolver: zodResolver(messageFormSchema),
    defaultValues: {
      message: ""
    }
  })

  const createMessage = useAction(api.public.messages.create);

  const onSubmit = async (values: MessageFormValues) => {
    if(!conversation || !contactSessionId) {
      return;
    }

    form.reset();

    await createMessage({
      threadId: conversation.threadId,
      prompt: values.message,
      contactSessionId
    })
  }

  const onBack = () => {
    setConversationId(null)
    setScreen("selection")
  }

  const suggestions = useMemo(() => {
    if(!widgetSettings) {
      return []
    }

    return Object.values(widgetSettings.defaultSuggestions)
  }, [widgetSettings])

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
        <AIConversation>
          <InfiniteScrollTrigger
            canLoadMore={canLoadMore}
            isLoadingMore={isLoadingMore}
            onLoadMore={handleLoadMore}
            ref={topElementRef}
          />
          <AIConversationContent>
            {toUIMessages(messages.results ?? [])?.map(message => (
              <AIMessage from={message.role === "user" ? "user" : "assistant"} key={message.id}>
                <AIMessageContent>
                  <AIResponse>{message.content}</AIResponse>
                </AIMessageContent>
                {
                  message.role === "assistant" && (
                    <DicebearAvatar
                      // imageUrl={"/logo.svg"}
                      seed={"assistant"}
                      size={32}
                    />
                  )
                }
              </AIMessage>
            ))}
          </AIConversationContent>
        </AIConversation>
        <AISuggestions className={"flex w-full flex-col items-end p-2"}>
          {
            toUIMessages(messages.results ?? [])?.length === 1 && (
              suggestions.map((suggestion, index) => {
                if(!suggestion) {
                  return null;
                }

                return (
                  <AISuggestion
                    key={index}
                    onClick={() => {
                      form.setValue("message", suggestion, {
                        shouldValidate: true,
                        shouldDirty: true,
                        shouldTouch: true,
                      })
                      form.handleSubmit(onSubmit)()
                    }}
                    suggestion={suggestion}
                  />
                )
              })
            )
          }

        </AISuggestions>
        <Form {...form}>
          <AIInput
            className={"rounded-none border-x-0 border-b-0"}
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              name={"message"}
              control={form.control}
              disabled={conversation?.status === "resolved"}
              render={({field}) => (
                <AIInputTextarea
                  disabled={conversation?.status === "resolved"}
                  onChange={field.onChange}
                  value={field.value}
                  onKeyDown={e => {
                    if(e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      form.handleSubmit(onSubmit)();
                    }
                  }}
                  placeholder={
                    conversation?.status === "resolved"
                      ? "This conversation has been resolved."
                      : "Type your message..."
                  }
                />
              )}
            />
            <AIInputToolbar>
              <AIInputTools />
              <AIInputSubmit
                disabled={conversation?.status === "resolved" || !form.formState.isValid}
                status={"ready"}
                title={"submit"}
              />
            </AIInputToolbar>
          </AIInput>
        </Form>
      </div>
    </>
  )
}
