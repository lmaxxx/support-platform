import {internalMutation, internalQuery} from "../_generated/server";
import {ConvexError, v} from "convex/values";
import {AUTO_REFRESH_THRESHOLD_MS, SESSION_DURATION_MS} from "../constants";

export const refresh = internalMutation({
  args: {
    contactSessionId: v.id("contactSessions")
  },
  handler: async (ctx, args) => {
    const contactSession = await ctx.db.get(args.contactSessionId)

    if(!contactSession) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Contact session not found"
      })
    }

    if(contactSession.expiresAt < Date.now()) {
      throw new ConvexError({
        code: "BAD_REQUEST",
        message: "Contact session expired"
      })
    }

    const timeRemaining = contactSession.expiresAt - Date.now();

    if(timeRemaining < AUTO_REFRESH_THRESHOLD_MS) {
      const newExpiresAt = Date.now() + SESSION_DURATION_MS;

      await ctx.db.patch(args.contactSessionId, {
        expiresAt: newExpiresAt
      })

      return { ...contactSession, expiresAt: newExpiresAt }
    }

    return contactSession;
  }
})

export const getOne = internalQuery({
  args: {
    contactSessionId: v.id("contactSessions")
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.contactSessionId)
  }
})

/**
 * Cleanup expired contact sessions
 * Runs hourly via cron job to maintain database hygiene and privacy
 */
export const cleanupExpiredSessions = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    // Find all expired sessions using the expiresAt index
    const expiredSessions = await ctx.db
      .query("contactSessions")
      .withIndex("by_expires_at")
      .filter(q => q.lt(q.field("expiresAt"), now))
      .collect();

    // Delete expired sessions in batches
    let deletedCount = 0;
    for (const session of expiredSessions) {
      await ctx.db.delete(session._id);
      deletedCount++;
    }

    console.log(`Cleaned up ${deletedCount} expired contact sessions`);

    return {
      deletedCount,
      timestamp: now
    };
  }
})