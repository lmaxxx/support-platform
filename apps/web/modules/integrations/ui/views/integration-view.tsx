"use client"

import {Label} from "@workspace/ui/components/label";
import {Input} from "@workspace/ui/components/input";
import {useOrganization} from "@clerk/nextjs";
import {Button} from "@workspace/ui/components/button";
import {CopyIcon} from "lucide-react";
import {toast} from "sonner";
import {Separator} from "@workspace/ui/components/separator";
import {IntegrationId, INTEGRATIONS} from "@/modules/integrations/constants";
import Image from "next/image"
import IntegrationsDialog from "@/modules/integrations/ui/components/integrations-dialog";
import {useState} from "react";
import {createScript} from "@/modules/integrations/utils";

export default function IntegrationView() {
  const {organization} = useOrganization();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSnippet, setSelectedSnippet] = useState("")

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(organization?.id ?? "")
      toast.success("Copied!");
    } catch (error) {
      toast.error("Could not copy to clipboard");
    }
  }

  const handleIntegrationClick = (integrationId: IntegrationId) => {
    if(!organization) {
      toast.error("Organization ID not found");
      return;
    }

    const snippet = createScript(integrationId, organization.id)
    setSelectedSnippet(snippet)
    setDialogOpen(true);
  }

  return (
    <>
      <IntegrationsDialog open={dialogOpen} onOpenChange={setDialogOpen} snippet={selectedSnippet} />
      <div className={"flex min-h-screen flex-col bg-muted p-8"}>
        <div className={"mx-auto w-full max-w-screen-md"}>
          <div className={"space-y-2"}>
            <h1 className={"text-2xl md:text-4xl"}>Setup & Integrations</h1>
            <p className={"text-muted-foreground"}>Choose the integration that's right for you</p>
          </div>
          <div className={"mt-8 space-y-6"}>
            <div className={"flex items-center gap-4"}>
              <Label className={"w-34"} htmlFor={"organization-id"}>
                Organization ID
              </Label>
              <Input
                className={"flex-1 bg-background font-mono text-sm"}
                disabled
                id={"organization-id"}
                value={organization?.id ?? ""}
              />
              <Button
                className={"gap-2"}
                onClick={handleCopy}
                size={"sm"}
              >
                <CopyIcon className={"size-4"}/>
                Copy
              </Button>
            </div>
          </div>
          <Separator className={"my-8"}/>
          <div className={"space-y-6"}>
            <div className={"space-y-1"}>
              <Label className={"text-lg"}>Integrations</Label>
              <p className={"text-muted-foreground text-sm"}>
                Add the following code to your website to enable the chatbox
              </p>
            </div>
            <div className={"grid grid-cols-2 gap-4 md:grid-cols-4"}>
              {
                INTEGRATIONS.map(integration => (
                  <button
                    key={integration.id}
                    className={"flex items-center gap-4 rounded-lg border bg-background p-4 hover:bg-accent"}
                    type="button"
                    onClick={() => handleIntegrationClick(integration.id)}
                  >
                    <Image
                      alt={integration.title}
                      height={32}
                      width={32}
                      src={integration.icon}
                    />
                    <p>{integration.title}</p>
                  </button>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
