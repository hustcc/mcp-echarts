import path from "node:path";
import { expect } from "vitest";
import { toImageEqual } from "./toImageEqual";
import type { toImageEqualOptions } from "./toImageEqual";

// Extend expect type
declare module "vitest" {
  interface Assertion<T = unknown> {
    toImageEqual(
      dir: string,
      name: string,
      options?: toImageEqualOptions,
    ): Promise<void>;
  }
}

// Add custom matcher
expect.extend({
  async toImageEqual(
    received: Buffer,
    dir: string,
    name: string,
    options: toImageEqualOptions = {},
  ) {
    const result = await toImageEqual(received, dir, name, options);
    return {
      pass: result.pass,
      message: result.message,
    };
  },
});

// Shared test configuration
export const TEST_CONFIG = {
  outputDir: path.join(__dirname, "../snapshots"),
  defaultWidth: 800,
  defaultHeight: 600,
  defaultTheme: "default" as const,
  defaultOutputType: "png" as const,
  defaultMaxError: 0.05,
} as const;

// Helper function to extract buffer from MCP tool response
export function extractImageBuffer(response: unknown): Buffer {
  if (Buffer.isBuffer(response)) {
    return response;
  }

  // Handle MCP tool response format with content array
  if (response && typeof response === "object" && "content" in response) {
    const content = (response as { content: unknown[] }).content;
    if (Array.isArray(content) && content.length > 0) {
      const item = content[0];
      if (
        item &&
        typeof item === "object" &&
        "type" in item &&
        "data" in item
      ) {
        const contentItem = item as { type: string; data: string };
        if (contentItem.type === "image" && contentItem.data) {
          return Buffer.from(contentItem.data, "base64");
        }
      }
    }
  }

  // Handle MCP content response format (direct array)
  if (Array.isArray(response) && response.length > 0) {
    const content = response[0];
    if (
      content &&
      typeof content === "object" &&
      "type" in content &&
      "data" in content
    ) {
      const contentItem = content as { type: string; data: string };
      if (contentItem.type === "image" && contentItem.data) {
        return Buffer.from(contentItem.data, "base64");
      }
    }
  }

  // Handle direct object response
  if (
    response &&
    typeof response === "object" &&
    "type" in response &&
    "data" in response
  ) {
    const contentItem = response as { type: string; data: string };
    if (contentItem.type === "image" && contentItem.data) {
      return Buffer.from(contentItem.data, "base64");
    }
  }

  throw new Error("Unable to extract image buffer from response");
}
