import {mutation, query} from "../_generated/server";
import {ConvexError, v} from "convex/values";
import {requireAuth} from "../lib/auth";

export const removeOne = mutation({
  args: {
    service: v.union(v.literal("vapi"))
  },
  handler: async (ctx, args) => {
    const { organizationId } = await requireAuth(ctx);

    const existingPlugin =  await ctx.db
      .query("plugins")
      .withIndex("by_organization_id_and_service", q =>
        q.eq("organizationId", organizationId).eq("service", args.service)
      )
      .unique();

    if(!existingPlugin) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Plugin not found"
      })
    }

    await ctx.db.delete(existingPlugin._id);
  }
})

export const getOne = query({
  args: {
    service: v.union(v.literal("vapi"))
  },
  handler: async (ctx, args) => {
    const { organizationId } = await requireAuth(ctx);

    return await ctx.db
      .query("plugins")
      .withIndex("by_organization_id_and_service", q =>
        q.eq("organizationId", organizationId).eq("service", args.service)
      )
      .unique();
  }
})

