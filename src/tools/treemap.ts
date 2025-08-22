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

// Define recursive schema for hierarchical data
const TreeNodeSchema: z.ZodType<TreemapDataType> = z.lazy(() =>
  z.object({
    name: z.string().describe("Node name, such as 'Design'."),
    value: z.number().describe("Node value, such as 70."),
    children: z
      .array(TreeNodeSchema)
      .optional()
      .describe("Child nodes for hierarchical structure."),
  }),
);

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
