import type { EChartsOption } from "echarts";
import { renderECharts } from "./render";

/**
 * 图片输出格式
 */
export type ImageOutputFormat = "png" | "svg" | "option";

/**
 * MCP内容类型
 */
export interface MCPContent {
  type: "image" | "text";
  data?: string;
  text?: string;
  mimeType?: string;
}

/**
 * 图片处理结果
 */
export interface ImageHandlerResult {
  content: MCPContent[];
}

/**
 * 统一的图片生成和处理方法
 * 根据配置自动决定返回base64图片数据还是MinIO URL的img标签
 *
 * @param echartsOption ECharts配置选项
 * @param width 图片宽度，默认800
 * @param height 图片高度，默认600
 * @param theme 主题，默认'default'
 * @param outputType 输出类型，默认'png'
 * @returns 统一格式的MCP响应内容
 */
export async function generateChartImage(
  echartsOption: EChartsOption,
  width = 800,
  height = 600,
  theme: "default" | "dark" = "default",
  outputType: ImageOutputFormat = "png",
): Promise<ImageHandlerResult> {
  // 渲染图表
  const result = await renderECharts(
    echartsOption,
    width,
    height,
    theme,
    outputType,
  );

  // 判断输出类型
  const isImage = outputType !== "svg" && outputType !== "option";

  if (!isImage) {
    // SVG或配置选项，直接返回文本
    return {
      content: [
        {
          type: "text",
          text: result,
        },
      ],
    };
  }

  // 图片类型，判断是URL还是base64
  const isUrl = result.startsWith("http");

  if (isUrl) {
    // MinIO URL，返回HTML img标签
    return {
      content: [
        {
          type: "text",
          text: `<img src="${result}" alt="Generated Chart" style="max-width: 100%; height: auto;" />`,
        },
      ],
    };
  }

  // base64数据，返回图片类型
  return {
    content: [
      {
        type: "image",
        data: result.startsWith("data:image/png;base64,")
          ? result.replace("data:image/png;base64,", "")
          : result,
        mimeType: "image/png",
      },
    ],
  };
}

/**
 * 为工具提供的便捷包装函数
 * 包含错误处理和调试日志
 *
 * @param echartsOption ECharts配置选项
 * @param width 图片宽度
 * @param height 图片高度
 * @param theme 主题
 * @param outputType 输出类型
 * @param toolName 工具名称（用于调试日志）
 * @returns MCP响应内容
 */
export async function generateChartImageForTool(
  echartsOption: EChartsOption,
  width = 800,
  height = 600,
  theme: "default" | "dark" = "default",
  outputType: ImageOutputFormat = "png",
  toolName = "unknown",
): Promise<ImageHandlerResult> {
  // 调试日志
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
    const result = await generateChartImage(
      echartsOption,
      width,
      height,
      theme,
      outputType,
    );

    // 成功日志
    if (process.env.DEBUG_MCP_ECHARTS) {
      console.error(`[DEBUG] ${toolName} chart generated successfully:`, {
        contentType: result.content[0].type,
        hasData: !!result.content[0].data,
        hasText: !!result.content[0].text,
        textPreview: result.content[0].text?.substring(0, 50),
      });
    }

    return result;
  } catch (error) {
    // 错误日志
    if (process.env.DEBUG_MCP_ECHARTS) {
      console.error(`[DEBUG] ${toolName} chart generation failed:`, {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
    }

    throw new Error(
      `Chart rendering failed: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}
