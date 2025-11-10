import {mutation, query} from "../_generated/server";
import {v} from "convex/values";
import {SESSION_DURATION_MS} from "../constants";
import {checkRateLimit, RateLimits} from "../lib/rateLimit";
import {validateEmail, validateOrganizationId} from "../lib/validation";

export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    organizationId: v.string(),
    metadata: v.optional(v.object({
      userAgent: v.optional(v.string()),
      language: v.optional(v.string()),
      languages: v.optional(v.string()),
      platform: v.optional(v.string()),
      vendor: v.optional(v.string()),
      screenResolution: v.optional(v.string()),
      viewportSize: v.optional(v.string()),
      timezone: v.optional(v.string()),
      timezoneOffset: v.optional(v.number()),
      cookieEnabled: v.optional(v.boolean()),
      referrer: v.optional(v.string()),
      currentUrl: v.optional(v.string())
    }))
  },
  handler: async (ctx, args) => {
    // Validate inputs
    validateEmail(args.email);
    validateOrganizationId(args.organizationId);

    // Rate limit check: 5 sessions per 5 minutes per email
    const rateLimitKey = `${args.organizationId}:${args.email}`;
    checkRateLimit(rateLimitKey, RateLimits.SESSION_CREATION);

    const now = Date.now()
    const expiresAt = now + SESSION_DURATION_MS;

    return await ctx.db.insert("contactSessions", {
      name: args.name,
      email: args.email,
      organizationId: args.organizationId,
      expiresAt,
      metadata: args.metadata,
    });
  }
})

/**
 * Validate a contact session (read-only operation)
 * Converted to query for proper read-only semantics
 */
export const validate = query({
  args: {
    contactSessionId: v.id("contactSessions")
  },
  handler: async (ctx, args) => {
    const contactSession = await ctx.db.get(args.contactSessionId)

    if(!contactSession) {
      return {valid: false, reason: "Contact session not found"};
    }

    if(contactSession.expiresAt < Date.now()) {
      return {valid: false, reason: "Contact session expired"};
    }

    return  {valid: true};
  }
})