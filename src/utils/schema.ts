import { z } from "zod";
import { zodToJsonSchema as zodToJsonSchemaOriginal } from "zod-to-json-schema";

export const WidthSchema = z
  .number()
  .int()
  .positive()
  .optional()
  .default(800)
  .describe("Set the width of the chart, default is 800px.");

export const HeightSchema = z
  .number()
  .int()
  .positive()
  .optional()
  .default(600)
  .describe("Set the height of the chart, default is 600px.");

export const TitleSchema = z
  .string()
  .optional()
  .describe("Set the title of the chart.");

// A schema for typical tabular data, e.g., [{ "date": "2024-01-01", "sales": 100 }, ...]
export const DataSchema = z
  .array(z.record(z.any()))
  .nonempty()
  .describe("The data for the chart, which should be an array of objects.");

export const CategoryFieldSchema = z
  .string()
  .describe(
    "The field name from the data to be used for the category axis (usually the x-axis).",
  );

export const ValueFieldSchema = z
  .string()
  .describe(
    "The field name from the data to be used for the value axis (usually the y-axis).",
  );

export const SeriesFieldSchema = z
  .string()
  .optional()
  .describe(
    "The field name from the data to be used for generating series (e.g., for multi-line charts).",
  );

// TODO: use zod v4 JSON to schema to replace zod-to-json-schema when v4 is stable
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const zodToJsonSchema = (schema: z.ZodType<any>) => {
  return zodToJsonSchemaOriginal(schema, {
    rejectedAdditionalProperties: undefined,
  });
};
