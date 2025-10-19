import { Doc } from "@workspace/backend/convex/_generated/dataModel";
import {z} from "zod";
import {useMutation} from "convex/react";
import {api} from "@workspace/backend/convex/_generated/api";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {toast} from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@workspace/ui/components/form";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@workspace/ui/components/card";
import {Input} from "@workspace/ui/components/input";
import {Textarea} from "@workspace/ui/components/textarea";
import {Separator} from "@workspace/ui/components/separator";
import {Button} from "@workspace/ui/components/button";
import VapiFormFields from "@/modules/customization/ui/componenets/vapi-form-fields";

export const widgetSettingsSchema = z.object({
  greetMessage: z.string().min(1, "Greeting message is required"),
  defaultSuggestions: z.object({
    suggestion1: z.string().optional(),
    suggestion2: z.string().optional(),
    suggestion3: z.string().optional(),
  }),
  vapiSettings: z.object({
    assistantId: z.string().optional(),
    phoneNumber: z.string().optional(),
  })
})

export type FormData = z.infer<typeof widgetSettingsSchema>

type Props = {
  initialData?: Doc<"widgetSettings"> | null
  hasVapiPlugin: boolean
}

export default function CustomizationForm({ initialData, hasVapiPlugin }: Props) {
  const upsertWidgetSetting = useMutation(api.private.widgetSettings.upsert)
  const form = useForm<FormData>({
    resolver: zodResolver(widgetSettingsSchema),
    defaultValues: {
      greetMessage: initialData?.greetMessage || "Hi! How can I help you today?",
      defaultSuggestions: {
        suggestion1: initialData?.defaultSuggestions.suggestion1 || "",
        suggestion2: initialData?.defaultSuggestions.suggestion2 || "",
        suggestion3: initialData?.defaultSuggestions.suggestion3 || "",
      },
      vapiSettings: {
        assistantId: initialData?.vapiSettings.assistantId || "",
        phoneNumber: initialData?.vapiSettings.phoneNumber || "",
      }
    }
  });

  const onSubmit = async (values: FormData) => {
    try {
      const vapiSettings: Doc<"widgetSettings">["vapiSettings"] = {
        assistantId: values.vapiSettings.assistantId === "none" ? "" : values.vapiSettings.assistantId,
        phoneNumber: values.vapiSettings.phoneNumber === "none" ? "" : values.vapiSettings.phoneNumber,
      }

      await upsertWidgetSetting({
        vapiSettings,
        greetMessage: values.greetMessage,
        defaultSuggestions: values.defaultSuggestions
      })

      toast.success("Widget settings saved")
    } catch (error) {
      toast.error("Something went wrong");
    }
  }


  return (
    <Form {...form}>
      <form className={"space-y-6"} onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>General Chat Settings</CardTitle>
            <CardDescription>Configure basic chat widget behaviour and messages</CardDescription>
          </CardHeader>
          <CardContent className={"space-y-6"}>
            <FormField
              control={form.control}
              name="greetMessage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Greeting message</FormLabel>
                  <FormControl>
                    <Textarea
                      className={"h-10 bg-background"}
                      placeholder={"Welcome message shown when chat open"}
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>The first message customers see when they open the chat</FormDescription>
                  <FormMessage/>
                </FormItem>
              )}
            />
            <Separator/>
            <div className={"space-y-4"}>
              <div>
                <h3 className={"mb-4 text-sm"}>Default Suggestions</h3>
                <p className={"mb-4 text-sm text-muted-foreground"}>
                  Quick reply suggestions shown to customers to help guide the conversation
                </p>
                <div className={"space-y-4"}>
                  <FormField
                    control={form.control}
                    name="defaultSuggestions.suggestion1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Suggestion 1</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={"How do I get started?"}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="defaultSuggestions.suggestion2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Suggestion 2</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={"e.g., What are your pricing plans?"}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="defaultSuggestions.suggestion3"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Suggestion 3</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={"I need help with my account"}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {
          hasVapiPlugin && (
            <Card>
              <CardHeader>
                <CardTitle>Voice Assistant Settings</CardTitle>
                <CardDescription>Configure voice calling features powered by Vapi</CardDescription>
              </CardHeader>
              <CardContent className={"space-y-6"}>
                <VapiFormFields
                  form={form}
                />
              </CardContent>
            </Card>
          )
        }
        <div className={"flex justify-end"}>
          <Button disabled={form.formState.isSubmitting} type="submit">
            Save Settings
          </Button>
        </div>
      </form>
    </Form>
  )
}
