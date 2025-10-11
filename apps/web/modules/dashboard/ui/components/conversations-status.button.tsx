import { Doc } from "@workspace/backend/convex/_generated/dataModel"
import Hint from "@workspace/ui/components/hint";
import {Button} from "@workspace/ui/components/button";
import {ArrowRightIcon, ArrowUpIcon, CheckIcon} from "lucide-react";

type Props = {
  status: Doc<"conversations">["status"],
  onClick: () => void;
  disabled?: boolean;
}

export default function ConversationsStatusButton({
  status,
  onClick,
  disabled = false
                                                  }: Props) {
  if(status === "resolved") {
    return (
      <Hint text={"Mark as unresolved"}>
        <Button disabled={disabled} onClick={onClick} size={"sm"} variant={"tertiary"}>
          <CheckIcon/>
          Resolved
        </Button>
      </Hint>
    )
  }

  if(status === "escalated") {
    return (
      <Hint text={"Mark as resolved"}>
        <Button disabled={disabled} onClick={onClick} size={"sm"} variant={"warning"}>
          <ArrowUpIcon/>
          Escalated
        </Button>
      </Hint>
    )
  }

  return (
      <Hint text={"Mark as escalated"}>
        <Button disabled={disabled} onClick={onClick} size={"sm"} variant={"destructive"}>
          <ArrowRightIcon/>
          Unresolved
        </Button>
      </Hint>

  )
}
