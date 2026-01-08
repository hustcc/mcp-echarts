import { z } from "zod";
import { zodToJsonSchema as zodToJsonSchemaOriginal } from "zod-to-json-schema";

export const AxisXTitleSchema = z
  .string()
  .optional()
  .default("")
  .describe("Set the x-axis title of chart.");

export const AxisYTitleSchema = z
  .string()
  .optional()
  .default("")
  .describe("Set the y-axis title of chart.");

export const HeightSchema = z
  .number()
  .int()
  .positive()
  .optional()
  .default(600)
  .describe("Set the height of the chart, default is 600px.");

export const ThemeSchema = z
  .enum(["default", "dark"])
  .optional()
  .default("default")
  .describe("Set the theme for the chart, optional, default is 'default'.");

export const OutputTypeSchema = z
  .enum(["png", "svg", "option"])
  .optional()
  .default("png")
  .describe(
    "The output type of the diagram. Can be 'png', 'svg' or 'option'. Default is 'png', 'png' will return the rendered PNG image, 'svg' will return the rendered SVG string, and 'option' will return the valid ECharts option.",
  );

export const TitleSchema = z
  .string()
  .optional()
  .describe("Set the title of the chart.");

export const WidthSchema = z
  .number()
  .int()
  .positive()
  .optional()
  .default(800)
  .describe("Set the width of the chart, default is 800px.");

// TODO: use zod v4 JSON to schema to replace zod-to-json-schema when v4 is stable
export const zodToJsonSchema = (schema: unknown): Record<string, unknown> => {
  // biome-ignore lint/suspicious/noExplicitAny: Type assertion needed to avoid TypeScript deep type instantiation
  return zodToJsonSchemaOriginal(schema as any, {
    rejectedAdditionalProperties: undefined,
  });
};
