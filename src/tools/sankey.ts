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

// Sankey chart data schema
const data = z.object({
  source: z.string().describe("Source node name, such as 'Landing Page'."),
  target: z.string().describe("Target node name, such as 'Product Page'."),
  value: z
    .number()
    .describe("Flow value between source and target, such as 50000."),
});

export const generateSankeyChartTool = {
  name: "generate_sankey_chart",
  description:
    "Generate a sankey chart to visualize the flow of data between different stages or categories, such as, the user journey from landing on a page to completing a purchase.",
  inputSchema: z.object({
    data: z
      .array(data)
      .describe(
        "Data for sankey chart, such as, [{ source: 'Landing Page', target: 'Product Page', value: 50000 }, { source: 'Product Page', target: 'Add to Cart', value: 35000 }].",
      )
      .nonempty({ message: "Sankey chart data cannot be empty." }),
    height: HeightSchema,
    nodeAlign: z
      .enum(["left", "right", "justify"])
      .optional()
      .default("justify")
      .describe(
        "Alignment of nodes in the sankey chart, such as, 'left', 'right', or 'justify'.",
      ),
    theme: ThemeSchema,
    title: TitleSchema,
    width: WidthSchema,
    outputType: OutputTypeSchema,
  }),
  run: async (params: {
    data: Array<{ source: string; target: string; value: number }>;
    height: number;
    nodeAlign?: "left" | "right" | "justify";
    theme?: "default" | "dark";
    title?: string;
    width: number;
    outputType?: "png" | "svg" | "option";
  }) => {
    const {
      data,
      height,
      nodeAlign = "justify",
      theme,
      title,
      width,
      outputType,
    } = params;

    // Extract unique nodes from data
    const nodeSet = new Set<string>();
    for (const item of data) {
      nodeSet.add(item.source);
      nodeSet.add(item.target);
    }

    // Create nodes array
    const nodes = Array.from(nodeSet).map((name) => ({ name }));

    // Create links array
    const links = data.map((item) => ({
      source: item.source,
      target: item.target,
      value: item.value,
    }));

    const series: Array<SeriesOption> = [
      {
        type: "sankey",
        data: nodes,
        links: links,
        emphasis: {
          focus: "adjacency",
        },
        nodeAlign: nodeAlign,
        left: "10%",
        top: "10%",
        right: "10%",
        bottom: "10%",
        label: {
          position: "right",
          color: "#000",
        },
        lineStyle: {
          color: "gradient",
          curveness: 0.5,
        },
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
        triggerOn: "mousemove",
      },
    };

    return await generateChartImage(
      echartsOption,
      width,
      height,
      theme,
      outputType,
      "generate_sankey_chart",
    );
  },
};
