import type {
  ImageContent,
  TextContent,
} from "@modelcontextprotocol/sdk/types.js";
import type { EChartsOption } from "echarts";
import { isMinIOConfigured, storeBufferToMinIO } from "./minio";
import { renderECharts } from "./render";

/**
 * Image output format
 */
export type ImageOutputFormat = "png" | "svg" | "option";

/**
 * MCP content type - using official MCP SDK types
 * This is a union of official MCP content types for better compatibility
 */
export type MCPContent = ImageContent | TextContent;

/**
 * Image processing result
 */
export interface ImageHandlerResult {
  content: MCPContent[];
}

/**
 * Unified chart image generation method
 * Automatically decides whether to return Base64 image data or MinIO URL based on configuration
 *
 * @param echartsOption ECharts configuration options
 * @param width Image width, default 800
 * @param height Image height, default 600
 * @param theme Theme, default 'default'
 * @param outputType Output type, default 'png'
 * @param toolName Tool name (for debug logging)
 * @returns Unified MCP response content format
 */
export async function generateChartImage(
  echartsOption: EChartsOption,
  width = 800,
  height = 600,
  theme: "default" | "dark" = "default",
  outputType: ImageOutputFormat = "png",
  toolName = "unknown",
): Promise<ImageHandlerResult> {
  // Debug logging
  if (process.env.DEBUG_MCP_ECHARTS) {
    console.error(`[DEBUG] ${toolName} generating chart:`, {
      width,
      height,
      theme,
      outputType,
      optionKeys: Object.keys(echartsOption),
    });
  }

  try {
    // Render chart
    const result = await renderECharts(
      echartsOption,
      width,
      height,
      theme,
      outputType,
    );

    // Determine output type
    const isImage = outputType !== "svg" && outputType !== "option";

    if (!isImage) {
      // SVG or configuration options, return text directly
      const response = {
        content: [
          {
            type: "text" as const,
            text: result as string,
          },
        ],
      };

      if (process.env.DEBUG_MCP_ECHARTS) {
        console.error(`[DEBUG] ${toolName} chart generated successfully:`, {
          contentType: "text",
          textLength: (result as string).length,
        });
      }

      return response;
    }

    // PNG image type
    const buffer = result as Buffer;

    if (isMinIOConfigured()) {
      // Use MinIO storage, return URL
      const url = await storeBufferToMinIO(buffer, "png", "image/png");

      const response = {
        content: [
          {
            type: "text" as const,
            text: url,
          },
        ],
      };

      if (process.env.DEBUG_MCP_ECHARTS) {
        console.error(`[DEBUG] ${toolName} chart generated successfully:`, {
          contentType: "text",
          url: url,
        });
      }

      return response;
    }

    // Fallback to Base64
    const base64Data = buffer.toString("base64");

    const response = {
      content: [
        {
          type: "image" as const,
          data: base64Data,
          mimeType: "image/png",
        },
      ],
    };

    if (process.env.DEBUG_MCP_ECHARTS) {
      console.error(`[DEBUG] ${toolName} chart generated successfully:`, {
        contentType: "image",
        dataLength: base64Data.length,
      });
    }

    return response;
  } catch (error) {
    // Error logging
    if (process.env.DEBUG_MCP_ECHARTS) {
      console.error(`[DEBUG] ${toolName} chart generation failed:`, {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
    }

    throw new Error(
      `Chart rendering failed: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
}
