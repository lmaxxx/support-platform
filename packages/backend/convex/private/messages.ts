import {action, mutation, query} from "../_generated/server";
import {ConvexError, v} from "convex/values";
import {components, internal} from "../_generated/api";
import {supportAgent} from "../system/ai/agents/supportAgent";
import {paginationOptsValidator} from "convex/server";
import {saveMessage} from "@convex-dev/agent";
import {generateText} from "ai";
import {anthropic} from "@ai-sdk/anthropic";

export const enhanceResponse = action({
  args: {
    prompt: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError({
        code: "NOT_FOUND",
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

    const response = await generateText({
      model: anthropic("claude-3-5-haiku-latest"),
      messages: [
        {
          role: "system",
          content: `
            You are a message enhancement assistant helping customers communicate more effectively with support teams.
            Your task is to refine the customer's message to make it clearer, more professional, and easier for support agents to understand and resolve.
            Guidelines:
            - Preserve the customer's original intent, concerns, and all key details
            - Improve clarity and structure without changing the meaning
            - Use professional yet friendly tone appropriate for customer support
            - Organize information logically (issue description, steps taken, desired outcome)
            - Fix grammar, spelling, and unclear phrasing
            - Keep the message concise but complete
            - do not use any variables.
            
            F.E wdym -> what do you mean? etc
            
            Important: Return ONLY the enhanced message text. No explanations, suggestions, or alternatives. The output will be sent directly to the support team on behalf of the customer.`
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
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError({
        code: "NOT_FOUND",
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

    const conversation = await ctx.db.get(args.conversationId)

    if (!conversation) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Conversation not found"
      })
    }

    if (conversation.organizationId !== organizationId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Invalid organization ID"
      })
    }

    if (conversation.status === "resolved") {
      throw new ConvexError({
        code: "BAD_REQUEST",
        message: "Conversation resolved"
      })
    }

    //TODO: implement subscription check

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
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError({
        code: "NOT_FOUND",
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

    if (conversation.organizationId !== organizationId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Invalid organization ID"
      })
    }

    return await supportAgent.listMessages(ctx, {
      threadId: args.threadId,
      paginationOpts: args.paginationOpts
    });
  }
})