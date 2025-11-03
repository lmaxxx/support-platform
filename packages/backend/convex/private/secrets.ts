import {ConvexError, v} from "convex/values";
import {upsertSecret} from "../lib/secrets";
import {internal} from "../_generated/api";
import {mutation} from "../_generated/server";
import {requireAuth} from "../lib/auth";

export const upsert = mutation({
  args: {
    service: v.union(v.literal("vapi")),
    value: v.any(),
  },
  handler: async (ctx, args) => {
    const { organizationId } = await requireAuth(ctx);

    await ctx.scheduler.runAfter(0, internal.system.secrets.upsert, {
      service: args.service,
      organizationId,
      value: args.value
    })
  }
})