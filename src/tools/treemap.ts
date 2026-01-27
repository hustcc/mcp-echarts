import type { EChartsOption, SeriesOption } from "echarts";
import { z } from "zod";
import { generateChartImage } from "../utils";
import {
  HeightSchema,
  OutputTypeSchema,
  ThemeSchema,
  TitleSchema,
  WidthSchema,
} from "../utils/schema";

// Treemap data type
type TreemapDataType = {
  name: string;
  value: number;
  children?: TreemapDataType[];
};

// Define schema for hierarchical data with explicit nesting to avoid unresolvable $ref
// We define the schema inline up to a reasonable depth (5 levels) to ensure compatibility
// with strict JSON Schema clients like PydanticAI that don't support relative $ref paths

// Level 5 (deepest) - no children
const TreemapNodeLevel5 = z.object({
  name: z.string().describe("Node name, such as 'Design'."),
  value: z.number().describe("Node value, such as 70."),
});

// Level 4
const TreemapNodeLevel4 = z.object({
  name: z.string().describe("Node name, such as 'Design'."),
  value: z.number().describe("Node value, such as 70."),
  children: z
    .array(TreemapNodeLevel5)
    .optional()
    .describe("Child nodes for hierarchical structure."),
});

// Level 3
const TreemapNodeLevel3 = z.object({
  name: z.string().describe("Node name, such as 'Design'."),
  value: z.number().describe("Node value, such as 70."),
  children: z
    .array(TreemapNodeLevel4)
    .optional()
    .describe("Child nodes for hierarchical structure."),
});

// Level 2
const TreemapNodeLevel2 = z.object({
  name: z.string().describe("Node name, such as 'Design'."),
  value: z.number().describe("Node value, such as 70."),
  children: z
    .array(TreemapNodeLevel3)
    .optional()
    .describe("Child nodes for hierarchical structure."),
});

// Level 1
const TreeNodeSchema = z.object({
  name: z.string().describe("Node name, such as 'Design'."),
  value: z.number().describe("Node value, such as 70."),
  children: z
    .array(TreemapNodeLevel2)
    .optional()
    .describe("Child nodes for hierarchical structure."),
  // biome-ignore lint/suspicious/noExplicitAny: Zod type inference requires any for recursive type compatibility
}) satisfies z.ZodType<TreemapDataType, any, any>;

export const generateTreemapChartTool = {
  name: "generate_treemap_chart",
  description:
    "Generate a treemap chart to display hierarchical data and can intuitively show comparisons between items at the same level, such as, show disk space usage with treemap.",
  inputSchema: z.object({
    data: z
      .array(TreeNodeSchema)
      .describe(
        "Data for treemap chart, such as, [{ name: 'Design', value: 70, children: [{ name: 'Tech', value: 20 }] }].",
      )
      .nonempty({ message: "Treemap chart data cannot be empty." }),
    height: HeightSchema,
    theme: ThemeSchema,
    title: TitleSchema,
    width: WidthSchema,
    outputType: OutputTypeSchema,
  }),
  run: async (params: {
    data: Array<TreemapDataType>;
    height: number;
    theme?: "default" | "dark";
    title?: string;
    width: number;
    outputType?: "png" | "svg" | "option";
  }) => {
    const { data, height, theme, title, width, outputType } = params;

    const series: Array<SeriesOption> = [
      {
        type: "treemap",
        data: data,
        left: "3%",
        right: "3%",
        bottom: "3%",
        label: {
          show: true,
          formatter: "{b}",
          fontSize: 12,
          color: "#fff",
        },
        emphasis: {
          focus: "descendant",
          itemStyle: {
            borderWidth: 3,
          },
          label: {
            fontSize: 16,
          },
        },
        breadcrumb: {
          show: false,
        },
        roam: false,
        nodeClick: "zoomToNode",
      },
    ];

    const echartsOption: EChartsOption = {
      series,
      title: {
        left: "center",
        text: title,
      },
      tooltip: {
        trigger: "item",
      },
    };

    return await generateChartImage(
      echartsOption,
      width,
      height,
      theme,
      outputType,
      "generate_treemap_chart",
    );
  },
};
