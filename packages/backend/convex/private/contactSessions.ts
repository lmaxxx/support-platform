import {query} from "../_generated/server";
import {ConvexError, v} from "convex/values";

export const getOneByConversationId = query({
  args: {
    conversationId: v.id("conversations")
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

    const conversation = await ctx.db.get(args.conversationId);

    if(!conversation) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Conversation not found"
      })
    }

    if(conversation.organizationId !== organizationId) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Invalid organization ID"
      })
    }

    return await ctx.db.get(conversation.contactSessionId);
  }
})