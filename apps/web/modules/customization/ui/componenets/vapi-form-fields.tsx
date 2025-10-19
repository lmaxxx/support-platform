import {UseFormReturn} from "react-hook-form";
import type {FormData as CustomizationFormData} from "@/modules/customization/ui/componenets/customization-form"
import {useVapiAssistants, useVapiPhoneNumbers} from "@/modules/plugins/hooks/use-vapi-data";
import {FormControl, FormField, FormItem, FormLabel, FormDescription, FormMessage} from "@workspace/ui/components/form";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@workspace/ui/components/select";

type Props = {
  form: UseFormReturn<CustomizationFormData>
}

export default function VapiFormFields({form}: Props) {
  const {data: assistants, isLoading: isAssistantsLoading} = useVapiAssistants();
  const {data: phoneNumbers, isLoading: isPhoneNumbersLoading} = useVapiPhoneNumbers();

  return (
    <>
      <FormField
        control={form.control}
        name="vapiSettings.assistantId"
        render={({field}) => (
          <FormItem>
            <FormLabel>Voice Assistant</FormLabel>
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={isAssistantsLoading || form.formState.isSubmitting}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue
                    placeholder={isAssistantsLoading ? "Loading assistants..." : "Select an assistant"}
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value={"none"}>None</SelectItem>
                {
                  assistants.map(assistant => (
                    <SelectItem key={assistant.id} value={assistant.id}>
                      {assistant.name || "Unnamed Assistant"} -{" "}
                      {assistant.model?.model || "Unnamed model"}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
            <FormDescription>The Vapi assistant to use for voice calls</FormDescription>
            <FormMessage/>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="vapiSettings.phoneNumber"
        render={({field}) => (
          <FormItem>
            <FormLabel>Display phone numbers</FormLabel>
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={isPhoneNumbersLoading || form.formState.isSubmitting}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue
                    placeholder={isPhoneNumbersLoading ? "Loading phone numbers..." : "Select a phone number"}
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value={"none"}>None</SelectItem>
                {
                  phoneNumbers.map(phone => (
                    <SelectItem key={phone.id} value={phone.id}>
                      {phone.number || "Unknown"} -{" "}
                      {phone.name || "Unnamed"}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
            <FormDescription>Phone number to display in the widget</FormDescription>
            <FormMessage/>
          </FormItem>
        )}
      />
    </>
  )
}
