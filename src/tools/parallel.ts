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

// Parallel chart data schema
const data = z.object({
  name: z.string().describe("Name or identifier for this data series."),
  values: z.array(z.number()).describe("Array of values for each dimension."),
});

export const generateParallelChartTool = {
  name: "generate_parallel_chart",
  description:
    "Generate a parallel coordinates chart to display multi-dimensional data, such as, comparing different products across multiple attributes.",
  inputSchema: z.object({
    data: z
      .array(data)
      .describe(
        "Data for parallel chart, such as, [{ name: 'Product A', values: [4.2, 3.4, 2.3, 1.8] }].",
      )
      .nonempty({ message: "Parallel chart data cannot be empty." }),
    dimensions: z
      .array(z.string())
      .describe(
        "Names of the dimensions/axes, such as, ['Price', 'Quality', 'Service', 'Value'].",
      )
      .nonempty({ message: "At least one dimension is required." }),
    height: HeightSchema,
    theme: ThemeSchema,
    title: TitleSchema,
    width: WidthSchema,
    outputType: OutputTypeSchema,
  }),
  run: async (params: {
    data: Array<{ name: string; values: number[] }>;
    dimensions: string[];
    height: number;
    theme?: "default" | "dark";
    title?: string;
    width: number;
    outputType?: "png" | "svg" | "option";
  }) => {
    const { data, dimensions, height, theme, title, width, outputType } =
      params;

    // Calculate min/max for each dimension
    const parallelAxis = dimensions.map((dim, index) => {
      const values = data
        .map((item) => item.values[index])
        .filter((v) => v !== undefined);
      const min = Math.min(...values);
      const max = Math.max(...values);
      const range = max - min;

      return {
        dim: index,
        name: dim,
        min: min - range * 0.1,
        max: max + range * 0.1,
        nameLocation: "start" as const,
      };
    });

    // Transform data for ECharts - create separate series for each data item
    const series: Array<SeriesOption> = data.map((item) => ({
      name: item.name,
      type: "parallel",
      data: [
        {
          name: item.name,
          value: item.values,
        },
      ],
      lineStyle: {
        width: 2,
        opacity: 0.7,
      },
      emphasis: {
        lineStyle: {
          width: 4,
          opacity: 1,
        },
      },
      smooth: true,
    }));

    const echartsOption: EChartsOption = {
      parallelAxis: parallelAxis,
      parallel: {
        left: "5%",
        right: "13%",
        bottom: "20%",
        top: "15%",
        parallelAxisDefault: {
          type: "value",
          nameLocation: "end",
          nameGap: 20,
          nameTextStyle: {
            fontSize: 12,
          },
          axisLine: {
            lineStyle: {
              color: "#aaa",
            },
          },
          axisTick: {
            lineStyle: {
              color: "#777",
            },
          },
          splitLine: {
            show: false,
          },
          axisLabel: {
            color: "#999",
          },
        },
      },
      series,
      title: {
        left: "center",
        text: title,
      },
      tooltip: {
        trigger: "item",
      },
      legend: {
        bottom: 30,
        data: data.map((item) => item.name),
      },
    };

    return await generateChartImage(
      echartsOption,
      width,
      height,
      theme,
      outputType,
      "generate_parallel_chart",
    );
  },
};
