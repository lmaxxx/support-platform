import {action, mutation, query} from "../_generated/server";
import {ConvexError, v} from "convex/values";
import {components, internal} from "../_generated/api";
import {supportAgent} from "../system/ai/agents/supportAgent";
import {paginationOptsValidator} from "convex/server";
import {saveMessage} from "@convex-dev/agent";
import {generateText} from "ai";
import {anthropic} from "@ai-sdk/anthropic";
import {OPERATOR_MESSAGE_ENHANCEMENT_PROMPT} from "../system/ai/constants";
import {requireAuth, requireOrganizationMatch} from "../lib/auth";
import {AI_MODEL} from "../constants";

export const enhanceResponse = action({
  args: {
    prompt: v.string(),
  },
  handler: async (ctx, args) => {
    const { organizationId } = await requireAuth(ctx);

    const subscription = await ctx.runQuery(
      internal.system.subscriptions.getByOrganizationId,
      { organizationId }
    )

    if(subscription?.status !== "active") {
      throw new ConvexError({
        code: "BAD_REQUEST",
        message: "Missing subscription"
      })
    }

    const response = await generateText({
      model: anthropic(AI_MODEL.CLAUDE_SONNET),
      messages: [
        {
          role: "system",
          content: OPERATOR_MESSAGE_ENHANCEMENT_PROMPT
        },
        {
          role: "user",
          content: args.prompt
        }
      ]
    })

    return response.text
  }
})

export const create = mutation({
  args: {
    prompt: v.string(),
    conversationId: v.id("conversations")
  },
  handler: async (ctx, args) => {
    const { identity, organizationId } = await requireAuth(ctx);

    const conversation = await ctx.db.get(args.conversationId)

    if (!conversation) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Conversation not found"
      })
    }

    requireOrganizationMatch(conversation.organizationId, organizationId);

    if (conversation.status === "resolved") {
      throw new ConvexError({
        code: "BAD_REQUEST",
        message: "Conversation resolved"
      })
    }

    // Check subscription status
    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_organization_id", q =>
        q.eq("organizationId", organizationId)
      )
      .unique()

    if (subscription?.status !== "active") {
      throw new ConvexError({
        code: "BAD_REQUEST",
        message: "Active subscription required"
      })
    }

    // Only update if status is still "unresolved" (atomic operation)
    const updatedConversation = await ctx.db.get(args.conversationId);
    if (updatedConversation?.status === "unresolved") {
      await ctx.db.patch(args.conversationId, {
        status: "escalated",
      });
    }

    await saveMessage(ctx, components.agent, {
      threadId: conversation.threadId,
      agentName: identity.familyName,
      message: {
        role: "assistant",
        content: args.prompt
      }
    })
  }
})

export const getMany = query({
  args: {
    threadId: v.string(),
    paginationOpts: paginationOptsValidator
  },
  handler: async (ctx, args) => {
    const { organizationId } = await requireAuth(ctx);

    const conversation = await ctx.db
      .query("conversations")
      .withIndex("by_thread_id", (q) => q.eq("threadId", args.threadId))
      .unique()

    if (!conversation) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Conversation not found"
      })
    }

    requireOrganizationMatch(conversation.organizationId, organizationId);

    return await supportAgent.listMessages(ctx, {
      threadId: args.threadId,
      paginationOpts: args.paginationOpts
    });
  }
})