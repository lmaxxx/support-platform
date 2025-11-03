import { ConvexError } from "convex/values";
import { QueryCtx, MutationCtx, ActionCtx } from "../_generated/server";

/**
 * Authentication context returned by requireAuth helpers
 */
export interface AuthContext {
  identity: NonNullable<Awaited<ReturnType<QueryCtx["auth"]["getUserIdentity"]>>>;
  organizationId: string;
}

/**
 * Validates user authentication and extracts organization context.
 *
 * @param ctx - Convex context (query, mutation, or action)
 * @returns Auth context with validated identity and organization ID
 * @throws ConvexError with UNAUTHORIZED code if identity is missing
 * @throws ConvexError with NOT_FOUND code if organization ID is missing
 *
 * @example
 * ```typescript
 * const { organizationId } = await requireAuth(ctx);
 * ```
 */
export async function requireAuth(
  ctx: QueryCtx | MutationCtx | ActionCtx
): Promise<AuthContext> {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    throw new ConvexError({
      code: "UNAUTHORIZED",
      message: "Identity not found"
    });
  }

  const organizationId = identity.org_id as string;

  if (!organizationId) {
    throw new ConvexError({
      code: "NOT_FOUND",
      message: "Organization not found"
    });
  }

  return { identity, organizationId };
}

/**
 * Validates that a resource belongs to the authenticated organization.
 *
 * @param resourceOrganizationId - Organization ID associated with the resource
 * @param authOrganizationId - Organization ID from auth context
 * @throws ConvexError with UNAUTHORIZED code if organization IDs don't match
 *
 * @example
 * ```typescript
 * const { organizationId } = await requireAuth(ctx);
 * const conversation = await ctx.db.get(conversationId);
 * requireOrganizationMatch(conversation.organizationId, organizationId);
 * ```
 */
export function requireOrganizationMatch(
  resourceOrganizationId: string,
  authOrganizationId: string
): void {
  if (resourceOrganizationId !== authOrganizationId) {
    throw new ConvexError({
      code: "UNAUTHORIZED",
      message: "Invalid organization ID"
    });
  }
}
