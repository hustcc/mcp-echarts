import type { EChartsOption, SeriesOption } from "echarts";
import { z } from "zod";
import { renderECharts } from "../utils/render";
import {
  HeightSchema,
  ThemeSchema,
  TitleSchema,
  WidthSchema,
} from "../utils/schema";

// Tree data type
type TreeDataType = {
  name: string;
  value?: number;
  children?: TreeDataType[];
};

// Define recursive schema for hierarchical data
const TreeNodeSchema: z.ZodType<TreeDataType> = z.lazy(() =>
  z.object({
    name: z.string().describe("Node name, such as 'Root'."),
    value: z.number().optional().describe("Node value (optional)."),
    children: z
      .array(TreeNodeSchema)
      .optional()
      .describe("Child nodes for hierarchical structure."),
  }),
);

export const generateTreeChartTool = {
  name: "generate_tree_chart",
  description:
    "Generate a tree chart to display hierarchical data structure, such as, organizational chart, family tree, or file directory structure.",
  inputSchema: z.object({
    data: TreeNodeSchema.describe(
      "Tree data structure, such as, { name: 'Root', children: [{ name: 'Child 1' }, { name: 'Child 2' }] }.",
    ),
    height: HeightSchema,
    layout: z
      .enum(["orthogonal", "radial"])
      .optional()
      .default("orthogonal")
      .describe("Tree layout type. Default is 'orthogonal'."),
    orient: z
      .enum(["LR", "RL", "TB", "BT"])
      .optional()
      .default("LR")
      .describe(
        "Tree orientation. LR=left-to-right, RL=right-to-left, TB=top-to-bottom, BT=bottom-to-top. Default is 'LR'.",
      ),
    theme: ThemeSchema,
    title: TitleSchema,
    width: WidthSchema,
  }),
  run: (params: {
    data: TreeDataType;
    height: number;
    layout?: "orthogonal" | "radial";
    orient?: "LR" | "RL" | "TB" | "BT";
    theme?: "default" | "dark";
    title?: string;
    width: number;
  }) => {
    const {
      data,
      height,
      layout = "orthogonal",
      orient = "LR",
      theme,
      title,
      width,
    } = params;

    const series: Array<SeriesOption> = [
      {
        type: "tree",
        data: [data],
        layout: layout,
        orient: orient,
        symbol: "emptyCircle",
        symbolSize: 7,
        initialTreeDepth: -1,
        itemStyle: {
          color: "#4154f3",
          borderWidth: 2,
        },
        lineStyle: {
          color: "#ccc",
          width: 1.5,
          curveness: 0.5,
        },
        label: {
          position:
            layout === "radial"
              ? "top"
              : orient === "LR"
                ? "right"
                : orient === "RL"
                  ? "left"
                  : orient === "TB"
                    ? "bottom"
                    : "top",
          verticalAlign: "middle",
          align:
            layout === "radial"
              ? "center"
              : orient === "LR"
                ? "left"
                : orient === "RL"
                  ? "right"
                  : "center",
          fontSize: 12,
        },
        leaves: {
          label: {
            position:
              layout === "radial"
                ? "top"
                : orient === "LR"
                  ? "right"
                  : orient === "RL"
                    ? "left"
                    : orient === "TB"
                      ? "bottom"
                      : "top",
            verticalAlign: "middle",
            align:
              layout === "radial"
                ? "center"
                : orient === "LR"
                  ? "left"
                  : orient === "RL"
                    ? "right"
                    : "center",
          },
        },
        emphasis: {
          focus: "descendant",
        },
        expandAndCollapse: true,
        animationDuration: 550,
        animationDurationUpdate: 750,
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

    const imageBase64 = renderECharts(echartsOption, width, height, theme);
    return {
      content: [
        {
          data: imageBase64,
          mimeType: "image/png",
          type: "image",
        },
      ],
    };
  },
};
