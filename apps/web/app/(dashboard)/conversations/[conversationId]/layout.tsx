import {ReactNode} from "react";
import ConversationIdLayout from "@/modules/dashboard/ui/layouts/conversation-id-layout";

export default function Layout({children}: {children: ReactNode}) {
  return (
    <ConversationIdLayout>{children}</ConversationIdLayout>
  )
}
