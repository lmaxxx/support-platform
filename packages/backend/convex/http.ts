import {httpRouter} from "convex/server";
import {httpAction} from "./_generated/server";
import {Webhook} from "svix";
import {createClerkClient, WebhookEvent} from "@clerk/backend";
import {internal} from "./_generated/api";
import {requireEnv} from "./lib/env";

const http = httpRouter();
const clerkClient = createClerkClient({
  secretKey: requireEnv("CLERK_SECRET_KEY"),
});

http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const event = await validateRequest(request)

    if(!event) {
      return new Response("Error occurred", {status: 400})
    }

    switch (event.type) {
      case "subscription.updated" : {
        const subscription = event.data as {
          status: string;
          payer?: {
            organization_id: string;
          }
        }

        const organizationId = subscription.payer?.organization_id;

        if(!organizationId) {
          return new Response("Missing Organization ID", {status: 400})
        }

        const newMaxAllowedMemberships = subscription.status === "active" ? 5 : 1

        await clerkClient.organizations.updateOrganization(organizationId, {
          maxAllowedMemberships: newMaxAllowedMemberships
        })

        await ctx.runMutation(internal.system.subscriptions.upsert, {
          organizationId,
          status: subscription.status
        })

        break
      }
      default:
        // Log ignored webhook events for monitoring
        console.log("Ignored Clerk webhook event", {
          eventType: event.type,
          timestamp: new Date().toISOString()
        });
    }

    return new Response(null, {status: 200})
  })
})


async function validateRequest(req: Request): Promise<WebhookEvent | null> {
  const payloadString = await req.text();
  const svixHeaders = {
    "svix-id": req.headers.get("svix-id") || "",
    "svix-timestamp": req.headers.get("svix-timestamp") || "",
    "svix-signature": req.headers.get("svix-signature") || "",
  }

  const webhook = new Webhook(requireEnv("CLERK_WEBHOOK_SECRET"));

  try {
    return webhook.verify(payloadString, svixHeaders) as WebhookEvent
  } catch (error) {
    // Invalid webhook signature - log for security monitoring
    console.error("Webhook signature verification failed", {
      error: error instanceof Error ? error.message : String(error),
      headers: {
        hasSvixId: !!svixHeaders["svix-id"],
        hasSvixTimestamp: !!svixHeaders["svix-timestamp"],
        hasSvixSignature: !!svixHeaders["svix-signature"],
      }
    });
    return null;
  }
}

export default http;