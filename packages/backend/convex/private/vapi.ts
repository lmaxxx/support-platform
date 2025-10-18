import {action} from "../_generated/server";
import {ConvexError} from "convex/values";
import {internal} from "../_generated/api";
import {getSecretValue, parseSecretString} from "../lib/secrets";
import {Vapi, VapiClient} from "@vapi-ai/server-sdk";

export const getPhoneNumbers = action({
  args: {},
  handler: async (ctx): Promise<Vapi.PhoneNumbersListResponseItem[]> => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Identity not found"
      })
    }

    const organizationId = identity.org_id as string

    if (!organizationId) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Organization not found"
      })
    }

    const plugin = await ctx.runQuery(
      internal.system.plugins.getByOrganizationIdAndService,
      {
        service: "vapi",
        organizationId
      }
    )

    if(!plugin) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Plugin not found"
      })
    }

    const secretName = plugin.secretName
    const secretValue = await getSecretValue(secretName);
    const secretData = parseSecretString<{
      publicApiKey: string
      privateApiKey: string
    }>(secretValue);

    if(!secretData) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Credentials not found"
      })
    }

    if(!secretData.privateApiKey || !secretData.publicApiKey) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Credentials incomplete. Please reconnect your Vapi account"
      })
    }

    const vapiClient = new VapiClient({
      token: secretData.privateApiKey
    })

    return vapiClient.phoneNumbers.list()
  }
})

export const getAssistants = action({
  args: {},
  handler: async (ctx): Promise<Vapi.Assistant[]> => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Identity not found"
      })
    }

    const organizationId = identity.org_id as string

    if (!organizationId) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Organization not found"
      })
    }

    const plugin = await ctx.runQuery(
      internal.system.plugins.getByOrganizationIdAndService,
      {
        service: "vapi",
        organizationId
      }
    )

    if(!plugin) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Plugin not found"
      })
    }

    const secretName = plugin.secretName
    const secretValue = await getSecretValue(secretName);
    const secretData = parseSecretString<{
      publicApiKey: string
      privateApiKey: string
    }>(secretValue);

    if(!secretData) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Credentials not found"
      })
    }

    if(!secretData.privateApiKey || !secretData.publicApiKey) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Credentials incomplete. Please reconnect your Vapi account"
      })
    }

    const vapiClient = new VapiClient({
      token: secretData.privateApiKey
    })

    return vapiClient.assistants.list();
  }
})