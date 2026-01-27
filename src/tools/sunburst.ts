import type { EChartsOption, SeriesOption } from "echarts";
import { z } from "zod";
import { generateChartImage } from "../utils";
import {
  HeightSchema,
  OutputTypeSchema,
  ThemeSchema,
  TitleSchema,
  WidthSchema,
  createHierarchicalSchema,
} from "../utils/schema";

// Sunburst data type
type SunburstDataType = {
  name: string;
  value: number;
  children?: SunburstDataType[];
};

// Create hierarchical schema using the reusable helper
const SunburstNodeSchema = createHierarchicalSchema(
  "Node name, such as 'Technology'.",
  "Node value, such as 100.",
  false, // value is required for sunburst
  // biome-ignore lint/suspicious/noExplicitAny: Zod type inference requires any for recursive type compatibility
) satisfies z.ZodType<SunburstDataType, any, any>;

export const generateSunburstChartTool = {
  name: "generate_sunburst_chart",
  description:
    "Generate a sunburst chart to display multi-level hierarchical data, such as, organizational structure, file system hierarchy, or category breakdown.",
  inputSchema: z.object({
    data: z
      .array(SunburstNodeSchema)
      .describe(
        "Data for sunburst chart, such as, [{ name: 'Technology', value: 100, children: [{ name: 'Frontend', value: 60, children: [{ name: 'React', value: 30 }] }] }].",
      )
      .nonempty({ message: "Sunburst chart data cannot be empty." }),
    height: HeightSchema,
    theme: ThemeSchema,
    title: TitleSchema,
    width: WidthSchema,
    outputType: OutputTypeSchema,
  }),
  run: async (params: {
    data: Array<SunburstDataType>;
    height: number;
    theme?: "default" | "dark";
    title?: string;
    width: number;
    outputType?: "png" | "svg" | "option";
  }) => {
    const { data, height, theme, title, width, outputType } = params;

    const series: Array<SeriesOption> = [
      {
        type: "sunburst",
        data: data,
        radius: [0, "90%"],
        center: ["50%", "50%"],
        sort: undefined,
        emphasis: {
          focus: "ancestor",
        },
        label: {
          show: true,
          fontSize: 12,
          color: "#000",
          minAngle: 10,
        },
        itemStyle: {
          borderRadius: 7,
          borderWidth: 2,
          borderColor: "#fff",
        },
        levels: [
          {},
          {
            r0: "15%",
            r: "35%",
            itemStyle: {
              borderWidth: 2,
            },
            label: {
              rotate: "tangential",
            },
          },
          {
            r0: "35%",
            r: "70%",
            label: {
              align: "right",
            },
          },
          {
            r0: "70%",
            r: "72%",
            label: {
              position: "outside",
              padding: 3,
              silent: false,
            },
            itemStyle: {
              borderWidth: 3,
            },
          },
        ],
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
      "generate_sunburst_chart",
    );
  },
};
