import {ArrowLeftRightIcon, LucideIcon, PlugIcon} from "lucide-react";
import Image from "next/image"
import {Button} from "@workspace/ui/components/button";

export type Feature = {
  icon: LucideIcon
  label: string
  description: string
}

type Props = {
  isDisabled?: boolean
  serviceName: string
  serviceImage: string
  features: Feature[]
  onSubmit: () => void;
}

export default function PluginCard({
  isDisabled = false,
  serviceName,
  serviceImage,
  features = [],
  onSubmit,
                                   }: Props) {
  return (
    <div className={"h-fit w-full rounded-lg border bg-background p-8"}>
      <div className={"mb-6 flex items-center justify-center gap-6"}>
        <div className={"flex flex-col items-center"}>
          <Image
            alt={serviceName}
            src={serviceImage}
            className={"rounded object-contain"}
            height={40}
            width={40}
          />
        </div>
        <div className={"flex flex-col items-center gap-1"}>
          <ArrowLeftRightIcon/>
        </div>
        <div className={"flex flex-col items-center"}>
          <Image
            alt={"Platform"}
            src={"/logo.svg"}
            className={"object-contain"}
            height={40}
            width={40}
          />
        </div>
      </div>
      <div className={"mb-6 text-center"}>
        <p className={"text-lg"}>Connect your {serviceName} account</p>
      </div>
      <div className={"mb-6"}>
        <div className={"space-y-4"}>
          {features.map(feature => (
            <div key={feature.label} className={"flex items-cener gap-3"}>
              <div className={"flex size-8 items-center justify-center rounded-lg border bg-muted"}>
                <feature.icon className={"size-4 text-muted-foreground"}/>
              </div>
              <div>
                <p className={"font-medium text-sm"}>{feature.label}</p>
                <p className={"text-muted-foreground text-xs"}>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={"text-center"}>
        <Button
          className={"w-full"}
          disabled={isDisabled}
          onClick={onSubmit}
        >
          Connect
          <PlugIcon/>
        </Button>
      </div>
    </div>
  )
}
