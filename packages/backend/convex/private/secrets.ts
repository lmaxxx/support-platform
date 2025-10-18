import {ConvexError, v} from "convex/values";
import {upsertSecret} from "../lib/secrets";
import {internal} from "../_generated/api";
import {mutation} from "../_generated/server";

export const upsert = mutation({
  args: {
    service: v.union(v.literal("vapi")),
    value: v.any(),
  },
  handler: async (ctx, args) => {
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

    await ctx.scheduler.runAfter(0, internal.system.secrets.upsert, {
      service: args.service,
      organizationId,
      value: args.value
    })
  }
})