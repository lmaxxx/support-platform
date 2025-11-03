import { Agent } from "@convex-dev/agent";
import { anthropic } from "@ai-sdk/anthropic";
import {components} from "../../../_generated/api";
import {AI_MODEL} from "../../../constants";

export const supportAgent = new Agent(components.agent, {
  chat: anthropic(AI_MODEL.CLAUDE_SONNET),
  instructions: `You are a customer support agent. Use "resolveConversation" tool when user expresses finalization of the conversation. Use "escalateConversation" tool when user expresses frustration, or request a human explicitly.`,
});