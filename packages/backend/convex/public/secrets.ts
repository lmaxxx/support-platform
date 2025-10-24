import {action} from "../_generated/server";
import {v} from "convex/values";
import {internal} from "../_generated/api";
import {getSecretValue, parseSecretString} from "../lib/secrets";

export const getVapiSecrets = action({
  args: {
    organizationId: v.string(),
  },
  handler: async (ctx, args) => {
    const plugin = await ctx.runQuery(
      internal.system.plugins.getByOrganizationIdAndService,
      {
        organizationId: args.organizationId,
        service: "vapi"
      }
    )

    if(!plugin) {
      return null;
    }

    const secret = await getSecretValue(plugin.secretName)
    const secretData = parseSecretString<{
      publicApiKey: string
      privateApiKey: string
    }>(secret)

    if(!secretData || !secretData.publicApiKey || !secretData.privateApiKey) {
      return null;
    }

    return {
      publicApiKey: secretData.publicApiKey
    }
  }
})