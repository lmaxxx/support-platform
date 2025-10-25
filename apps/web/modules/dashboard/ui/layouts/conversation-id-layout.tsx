import {ReactNode} from "react";
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@workspace/ui/components/resizable";
import ContactPanel from "@/modules/dashboard/ui/components/contact-panel";

export default function ConversationIdLayout({children}: {children: ReactNode}) {
  return (
    <ResizablePanelGroup className={"h-full flex-1"} direction={"horizontal"}>
      <ResizablePanel className={"h-full"} defaultSize={60}>
        <div className={"flex h-full flex-1 flex-col"}>{children}</div>
      </ResizablePanel>
      <ResizableHandle/>
      <ResizablePanel
        className={"h-full lg:block"}
        defaultSize={40}
        maxSize={40}
        minSize={20}
      >
        <ContactPanel/>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
