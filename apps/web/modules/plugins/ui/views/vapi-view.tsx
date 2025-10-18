"use client"

import React, {useState} from 'react'
import PluginCard, {Feature} from "@/modules/plugins/ui/components/plugin-card";
import {GlobeIcon, LoaderIcon, PhoneCallIcon, PhoneIcon, Wand2Icon, WorkflowIcon} from "lucide-react";
import {useMutation, useQuery} from "convex/react";
import {api} from "@workspace/backend/convex/_generated/api";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@workspace/ui/components/dialog";
import {Label} from "@workspace/ui/components/label";
import {Input} from "@workspace/ui/components/input";
import {Button} from "@workspace/ui/components/button";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@workspace/ui/components/form";

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

const formSchema = z.object({
  publicApiKey: z.string().min(1, {message: "Public API key is required"}),
  privateApiKey: z.string().min(1, {message: "Private API key is required"}),
})

type FormType = z.infer<typeof formSchema>

function VapiPluginForm({open, setOpen}: any) {
  const upsertSecret = useMutation(api.private.secrets.upsert)
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      publicApiKey: "",
      privateApiKey: "",
    }
  })

  const onSubmit = async (values: FormType) => {
    try {
      await upsertSecret({
        service: "vapi",
        value: {
          publicKey: values.publicApiKey,
          privateApiKey: values.privateApiKey,
        }
      })
      setOpen(false)
    } catch (error) {
      toast.error("Something went wrong")
    }
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enable Vapi</DialogTitle>
          <DialogDescription>
            Your API keys are safely encrypted and stored using AWS Secrets Manager.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className={"flex flex-col gap-y-4"} onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="publicApiKey"
              render={({ field }) => (
                <FormItem>
                  <Label>Public API key</Label>
                  <FormControl>
                    <Input
                      placeholder={"Your public API key"}
                      type={"password"}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="privateApiKey"
              render={({ field }) => (
                <FormItem>
                  <Label>Private API key</Label>
                  <FormControl>
                    <Input
                      placeholder={"Your private API key"}
                      type={"password"}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />
            <DialogFooter>
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting && <LoaderIcon className={"animate-spin"}/>}
                  {form.formState.isSubmitting ? "Connecting..." : "Connect"}
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default function VapiView() {
  const vapiPlugin = useQuery(api.private.plugins.getOne, {service: "vapi" })

  const [connectOpen, setConnectOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);

  const handleSubmit = () => {
    if(vapiPlugin) {
      setRemoveOpen(true);
    } else {
      setConnectOpen(true);
    }
  }

  return (
    <>
      <VapiPluginForm setOpen={setConnectOpen} open={connectOpen} />
      <div className={"flex min-h-screen flex-col bg-muted p-8"}>
        <div className={"mx-auto w-full max-w-screen-md"}>
          <div className={"space-y-2"}>
            <h1 className={"text-2xl md:text-4xl"}>Vapi Plugin</h1>
            <p>Connect Vapi to enable AI voice calls and phone support</p>
          </div>
          <div className={"mt-8"}>
            {
              vapiPlugin ? (
                <p>Connected</p>
              ) : (
                <PluginCard
                  serviceImage={"/vapi.jpg"}
                  serviceName={"Vapi"}
                  features={vapiFeatures}
                  isDisabled={vapiFeatures === undefined} // Convex returns undefined when loading
                  onSubmit={handleSubmit}
                />
              )
            }
          </div>
        </div>
      </div>
    </>
  )
}
