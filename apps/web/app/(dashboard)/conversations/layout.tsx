import React, {ReactNode} from 'react'
import ConversationsLayout from "@/modules/dashboard/ui/layouts/conversations-layout";

export default function Layout({children}: { children: ReactNode }) {
  return (
    <ConversationsLayout>
      {children}
    </ConversationsLayout>
  )
}
