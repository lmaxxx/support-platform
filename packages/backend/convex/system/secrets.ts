import {internalAction} from "../_generated/server";
import {v} from "convex/values";
import {upsertSecret} from "../lib/secrets";
import {internal} from "../_generated/api";

export const upsert = internalAction({
  args: {
    organizationId: v.string(),
    service: v.union(v.literal("vapi")),
    value: v.any(),
  },
  handler: async (ctx, args) => {
    const secretName = `tenant/${args.organizationId}/${args.service}`

    await upsertSecret(secretName, args.value)

    await ctx.runMutation(internal.system.plugins.upsert, {
      secretName,
      service: args.service,
      organizationId: args.organizationId
    })

    return {status: "success"}
  }
})