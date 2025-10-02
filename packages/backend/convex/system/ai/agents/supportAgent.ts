import { Agent } from "@convex-dev/agent";
import { anthropic } from "@ai-sdk/anthropic";
import {components} from "../../../_generated/api";

export const supportAgent = new Agent(components.agent, {
  chat: anthropic("claude-4-sonnet-20250514"),
  instructions: "You are a customer support agent.",
});