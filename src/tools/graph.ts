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

// Node schema
const NodeSchema = z.object({
  id: z.string().describe("Unique identifier for the node."),
  name: z.string().describe("Display name of the node."),
  value: z
    .number()
    .optional()
    .describe("Value associated with the node (affects size)."),
  category: z
    .string()
    .optional()
    .describe("Category of the node (affects color)."),
});

// Edge schema
const EdgeSchema = z.object({
  source: z.string().describe("Source node id."),
  target: z.string().describe("Target node id."),
  value: z.number().optional().describe("Weight or value of the edge."),
});

export const generateGraphChartTool = {
  name: "generate_graph_chart",
  description:
    "Generate a network graph chart to show relationships (edges) between entities (nodes), such as, relationships between people in social networks.",
  inputSchema: z.object({
    data: z
      .object({
        nodes: z
          .array(NodeSchema)
          .describe("Array of nodes in the network.")
          .nonempty({ message: "At least one node is required." }),
        edges: z
          .array(EdgeSchema)
          .describe("Array of edges connecting nodes.")
          .optional()
          .default([]),
      })
      .describe(
        "Data for network graph chart, such as, { nodes: [{ id: 'node1', name: 'Node 1' }], edges: [{ source: 'node1', target: 'node2' }] }",
      ),
    height: HeightSchema,
    layout: z
      .enum(["force", "circular", "none"])
      .optional()
      .default("force")
      .describe("Layout algorithm for the graph. Default is 'force'."),
    theme: ThemeSchema,
    title: TitleSchema,
    width: WidthSchema,
    outputType: OutputTypeSchema,
  }),
  run: async (params: {
    data: {
      nodes: Array<{
        id: string;
        name: string;
        value?: number;
        category?: string;
      }>;
      edges: Array<{ source: string; target: string; value?: number }>;
    };
    height: number;
    layout?: "force" | "circular" | "none";
    theme?: "default" | "dark";
    title?: string;
    width: number;
    outputType?: "png" | "svg" | "option";
  }) => {
    const {
      data,
      height,
      layout = "force",
      theme,
      title,
      width,
      outputType,
    } = params;

    // Validate that all edge nodes exist in nodes array
    const nodeIds = new Set(data.nodes.map((node) => node.id));
    const validEdges = data.edges.filter(
      (edge) => nodeIds.has(edge.source) && nodeIds.has(edge.target),
    );

    // Extract unique categories for legend
    const categories = Array.from(
      new Set(
        data.nodes
          .map((node) => node.category)
          .filter((cat): cat is string => Boolean(cat)),
      ),
    );

    // Transform nodes for ECharts
    const nodes = data.nodes.map((node) => ({
      id: node.id,
      name: node.name,
      symbolSize: node.value ? Math.sqrt(node.value) * 10 : 20,
      category: node.category,
      value: node.value,
    }));

    // Transform edges for ECharts
    const links = validEdges.map((edge) => ({
      source: edge.source,
      target: edge.target,
      value: edge.value,
    }));

    const series: Array<SeriesOption> = [
      {
        type: "graph",
        data: nodes,
        links: links,
        categories: categories.map((cat) => ({ name: cat })),
        roam: true,
        layout: layout,
        force:
          layout === "force"
            ? {
                repulsion: 100,
                gravity: 0.02,
                edgeLength: 150,
                layoutAnimation: true,
              }
            : undefined,
        label: {
          show: true,
          position: "right",
          formatter: "{b}",
        },
        lineStyle: {
          color: "source",
          curveness: 0.3,
        },
        emphasis: {
          focus: "adjacency",
          label: {
            fontSize: 16,
          },
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
      },
      legend:
        categories.length > 0
          ? {
              left: "center",
              orient: "horizontal",
              bottom: 10,
              data: categories,
            }
          : undefined,
    };

    return await generateChartImage(
      echartsOption,
      width,
      height,
      theme,
      outputType,
      "generate_graph_chart",
    );
  },
};
