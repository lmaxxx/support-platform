import { z } from "zod";

/**
 * Shared Zod schemas for form validation across the application.
 * These schemas ensure consistent validation logic for common form inputs.
 */

/**
 * Schema for message input forms.
 * Used in chat interfaces to validate user messages before submission.
 *
 * @example
 * ```typescript
 * import { messageFormSchema } from "@workspace/ui/lib/schemas";
 *
 * const form = useForm({
 *   resolver: zodResolver(messageFormSchema),
 * });
 * ```
 */
export const messageFormSchema = z.object({
  message: z.string().min(1, "Message is required")
});

export type MessageFormValues = z.infer<typeof messageFormSchema>;
