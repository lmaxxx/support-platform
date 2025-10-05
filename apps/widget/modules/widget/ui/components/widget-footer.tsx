import {Button} from "@workspace/ui/components/button";
import {HomeIcon, InboxIcon} from "lucide-react";
import {cn} from "@workspace/ui/lib/utils";
import {useAtom} from "jotai";
import {screenAtom} from "@/modules/widget/atoms/widget-atoms";

export default function WidgetFooter() {
  const [screen, setScreen] = useAtom(screenAtom);

  return (
    <footer className={"flex items-center justify-between border-t bg-background"}>
      <Button
        onClick={() => setScreen("selection")}
        className={"h-14 flex-1 rounded-none"} size={"icon"} variant={"ghost"}>
        <HomeIcon className={cn("size-5", screen === "selection" && "text-primary")} />
      </Button>
      <Button
        onClick={() => setScreen("inbox")}
        className={"h-14 flex-1 rounded-none"} size={"icon"} variant={"ghost"}>
        <InboxIcon className={cn("size-5", screen === "inbox" && "text-primary")} />
      </Button>
    </footer>
  )
}
