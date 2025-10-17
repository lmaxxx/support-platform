import {anthropic} from "@ai-sdk/anthropic";
import {Id} from "../_generated/dataModel";
import {StorageActionWriter} from "convex/server";
import {assert} from "convex-helpers";
import {generateText} from "ai";

const AI_MODELS = {
  image: anthropic.languageModel("claude-4-sonnet-20250514"),
  pdf: anthropic.languageModel("claude-4-sonnet-20250514"),
  html: anthropic.languageModel("claude-4-sonnet-20250514")
} as const;

const SUPPORTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]

const SYSTEM_PROMPT = {
  image: "You turn into text. If it is a photo of a document, transcribe it. If it is not a document, describe it",
  pdf: "Your transform PDF file into text",
  html: "Your transform content into markdown",
}

export type ExtractTextContentArgs = {
  storageId: Id<"_storage">,
  filename: string
  bytes?: ArrayBuffer,
  mimeType: string
}

export default async function extractTextContent(
  ctx: {storage: StorageActionWriter},
  args: ExtractTextContentArgs
): Promise<string> {
  const {storageId, mimeType, filename, bytes} = args;

  const url = await ctx.storage.getUrl(storageId);
  assert(url, "Failed to get storage URL")

  if(SUPPORTED_IMAGE_TYPES.some(type => type === mimeType)) {
    return extractImageText(url);
  }

  if(mimeType.toLowerCase().includes("pdf")) {
    return extractPdfText(url, mimeType, filename);
  }

  if(mimeType.toLowerCase().includes("text")) {
    return extractTextFileContent(ctx, storageId, bytes, mimeType)
  }

  throw new Error(`Unsupported MIME type "${mimeType}"`)
}

async function extractImageText(url: string): Promise<string> {
  const result = await generateText({
    model: AI_MODELS.image,
    system: SYSTEM_PROMPT.image,
    messages: [
      {
        role: "user",
        content: [{type: "image", image: new URL(url)}]
      }
    ]
  })

  return result.text;
}

async function extractPdfText(url: string, mimeType: string, filename: string): Promise<string> {
  const result = await generateText({
    model: AI_MODELS.pdf,
    system: SYSTEM_PROMPT.pdf,
    messages: [
      {
        role: "user",
        content: [
          {type: "file", data: new URL(url), mimeType, filename},
          {type: "text", text: "Extract the text from the PDF and print if without explaining you'll do so."}
        ]
      }
    ]
  })

  return result.text;
}

async function extractTextFileContent(
  ctx: {storage: StorageActionWriter},
  storageId: Id<"_storage">,
  bytes: ArrayBuffer | undefined,
  mimeType: string
): Promise<string> {
  const arrayBuffer = bytes || (await (await ctx.storage.get(storageId))?.arrayBuffer())

  if(!arrayBuffer) {
    throw new Error(`Failed to get file content for storage ID: ${storageId}`)
  }

  const text = new TextDecoder().decode(arrayBuffer)

  if(mimeType.toLowerCase() !== "text/plain") {
    const result = await generateText({
      model: AI_MODELS.html,
      system: SYSTEM_PROMPT.html,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text
            },
            {
              type: "text",
              text: "Extract the text and print it in markdown format without explaining you'll do so."
            },
          ]
        }
      ]
    })

    return result.text;
  }

  return text;
}