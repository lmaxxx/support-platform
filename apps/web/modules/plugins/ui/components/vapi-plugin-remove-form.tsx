import {useMutation} from "convex/react";
import {api} from "@workspace/backend/convex/_generated/api";
import {toast} from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@workspace/ui/components/dialog";
import {Button} from "@workspace/ui/components/button";
import React from "react";

export default function VapiPluginRemoveForm({open, setOpen}: any) {
  const removePlugin = useMutation(api.private.plugins.removeOne);

  const onSubmit = async () => {
    try {
      await removePlugin({service: "vapi"})
      setOpen(false)
      toast.success("Vapi plugin removed")
    } catch (error) {
      toast.error("Something went wrong")
    }
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Disconnect Vapi</DialogTitle>
          <DialogDescription>
            Are you sure you want to disconnect the Vapi plugin?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onSubmit} variant={"destructive"}>Disconnect</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}