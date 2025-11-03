import {query} from "../_generated/server";
import {ConvexError, v} from "convex/values";
import {requireAuth, requireOrganizationMatch} from "../lib/auth";

export const getOneByConversationId = query({
  args: {
    conversationId: v.id("conversations")
  },
  handler: async (ctx, args) => {
    const { organizationId } = await requireAuth(ctx);

    const conversation = await ctx.db.get(args.conversationId);

    if(!conversation) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Conversation not found"
      })
    }

    requireOrganizationMatch(conversation.organizationId, organizationId);

    return await ctx.db.get(conversation.contactSessionId);
  }
})