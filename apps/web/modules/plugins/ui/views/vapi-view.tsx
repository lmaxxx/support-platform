"use client"

import React, {useState} from 'react'
import PluginCard, {Feature} from "@/modules/plugins/ui/components/plugin-card";
import {GlobeIcon, PhoneCallIcon, PhoneIcon, WorkflowIcon} from "lucide-react";
import {useQuery} from "convex/react";
import {api} from "@workspace/backend/convex/_generated/api";
import VapiPluginForm from "@/modules/plugins/ui/components/vapi-plugin-form";
import VapiConnectedPanel from "@/modules/plugins/ui/components/vapi-connected-panel";
import VapiPluginRemoveForm from "@/modules/plugins/ui/components/vapi-plugin-remove-form";

const vapiFeatures: Feature[] = [
  {
    icon: GlobeIcon,
    label: "Web voice calls",
    description: "Voice chat directly in your app"
  },
  {
    icon: PhoneIcon,
    label: "Phone numbers",
    description: "Get dedicated business lines"
  },
  {
    icon: PhoneCallIcon,
    label: "Outbound calls",
    description: "Automated customer outreach"
  },
  {
    icon: WorkflowIcon,
    label: "Workflows",
    description: "Custom conversation flows"
  },
]

export default function VapiView() {
  const vapiPlugin = useQuery(api.private.plugins.getOne, {service: "vapi" })

  const [connectOpen, setConnectOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);

  const toggleConnection = () => {
    if(vapiPlugin) {
      setRemoveOpen(true);
    } else {
      setConnectOpen(true);
    }
  }

  return (
    <>
      <VapiPluginForm setOpen={setConnectOpen} open={connectOpen} />
      <VapiPluginRemoveForm setOpen={setRemoveOpen} open={removeOpen} />
      <div className={"flex min-h-screen flex-col bg-muted p-8"}>
        <div className={"mx-auto w-full max-w-screen-md"}>
          <div className={"space-y-2"}>
            <h1 className={"text-2xl md:text-4xl"}>Vapi Plugin</h1>
            <p>Connect Vapi to enable AI voice calls and phone support</p>
          </div>
          <div className={"mt-8"}>
            {
              vapiPlugin ? (
                <VapiConnectedPanel onDisconnect={toggleConnection}/>
              ) : (
                <PluginCard
                  serviceImage={"/vapi.jpg"}
                  serviceName={"Vapi"}
                  features={vapiFeatures}
                  isDisabled={vapiFeatures === undefined} // Convex returns undefined when loading
                  onSubmit={toggleConnection}
                />
              )
            }
          </div>
        </div>
      </div>
    </>
  )
}
