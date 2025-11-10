/**
 * Validation utilities for input data
 */

import {ConvexError} from "convex/values";

/**
 * Email validation regex (RFC 5322 simplified)
 * Validates most common email formats
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validate email format
 * @param email - Email address to validate
 * @throws ConvexError if email is invalid
 */
export function validateEmail(email: string): void {
  if (!email || typeof email !== 'string') {
    throw new ConvexError({
      code: "BAD_REQUEST",
      message: "Email is required"
    });
  }

  const trimmed = email.trim();

  if (trimmed.length === 0) {
    throw new ConvexError({
      code: "BAD_REQUEST",
      message: "Email cannot be empty"
    });
  }

  if (trimmed.length > 254) {
    throw new ConvexError({
      code: "BAD_REQUEST",
      message: "Email is too long (max 254 characters)"
    });
  }

  if (!EMAIL_REGEX.test(trimmed)) {
    throw new ConvexError({
      code: "BAD_REQUEST",
      message: "Invalid email format"
    });
  }
}

/**
 * Validate Clerk organization ID format
 * Clerk org IDs start with "org_" followed by alphanumeric characters
 */
const CLERK_ORG_ID_REGEX = /^org_[a-zA-Z0-9]+$/;

/**
 * Validate Clerk organization ID format
 * @param organizationId - Organization ID to validate
 * @throws ConvexError if organization ID is invalid
 */
export function validateOrganizationId(organizationId: string): void {
  if (!organizationId || typeof organizationId !== 'string') {
    throw new ConvexError({
      code: "BAD_REQUEST",
      message: "Organization ID is required"
    });
  }

  const trimmed = organizationId.trim();

  if (!CLERK_ORG_ID_REGEX.test(trimmed)) {
    throw new ConvexError({
      code: "BAD_REQUEST",
      message: "Invalid organization ID format. Must start with 'org_' followed by alphanumeric characters."
    });
  }
}
