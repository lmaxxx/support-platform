import {z} from "zod";
import {useMutation} from "convex/react";
import {api} from "@workspace/backend/convex/_generated/api";
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
import {Form, FormControl, FormField, FormItem, FormMessage} from "@workspace/ui/components/form";
import {Label} from "@workspace/ui/components/label";
import {Input} from "@workspace/ui/components/input";
import {Button} from "@workspace/ui/components/button";
import {LoaderIcon} from "lucide-react";
import React, {useEffect} from "react";

const formSchema = z.object({
  publicApiKey: z.string().min(1, {message: "Public API key is required"}),
  privateApiKey: z.string().min(1, {message: "Private API key is required"}),
})

type FormType = z.infer<typeof formSchema>

export default function VapiPluginForm({open, setOpen}: any) {
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
          publicApiKey: values.publicApiKey,
          privateApiKey: values.privateApiKey,
        }
      })
      setOpen(false)
      toast.success("Vapi plugin connected")
    } catch (error) {
      toast.error("Something went wrong")
    }
  }

  useEffect(() => {
    if(open) {
      form.reset()
    }
  }, [open])

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