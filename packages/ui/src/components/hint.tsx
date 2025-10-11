import {ReactNode} from "react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@workspace/ui/components/tooltip";

type Props = {
  children: ReactNode
  text: string
  side?: "top" | "bottom" | "left" | "right"
  align?: "start" | "center" | "end"
}

export default function Hint({
  children,
  text,
  side = "top",
  align = "center",
                             }: Props) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>
          <p>{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>

  )
}
