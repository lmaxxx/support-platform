import {action} from "../_generated/server";
import {v} from "convex/values";
import {createClerkClient} from "@clerk/backend";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY || ""
})

export const valiadte = action({
  args: {
    organizationId: v.string(),
  },
  handler: async (_, args) => {
    try {
      const organization = await clerkClient.organizations.getOrganization({
        organizationId: args.organizationId
      })

      if(!organization) {
        return {valid: false, reason: "Organization not valid"};
      }

      return {valid: true};
    } catch {
      return {valid: false, reason: "Organization not valid"}
    }
  }
})