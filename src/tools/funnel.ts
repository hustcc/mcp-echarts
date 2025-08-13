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

// Funnel chart data schema
const data = z.object({
  category: z
    .string()
    .describe("Stage category name, such as 'Browse Website'."),
  value: z.number().describe("Value at this stage, such as 50000."),
});

export const generateFunnelChartTool = {
  name: "generate_funnel_chart",
  description:
    "Generate a funnel chart to visualize the progressive reduction of data as it passes through stages, such as, the conversion rates of users from visiting a website to completing a purchase.",
  inputSchema: z.object({
    data: z
      .array(data)
      .describe(
        "Data for funnel chart, such as, [{ category: 'Browse Website', value: 50000 }, { category: 'Add to Cart', value: 35000 }, { category: 'Generate Order', value: 25000 }].",
      )
      .nonempty({ message: "Funnel chart data cannot be empty." }),
    height: HeightSchema,
    theme: ThemeSchema,
    title: TitleSchema,
    width: WidthSchema,
    outputType: OutputTypeSchema,
  }),
  run: async (params: {
    data: Array<{ category: string; value: number }>;
    height: number;
    theme?: "default" | "dark";
    title?: string;
    width: number;
    outputType?: "png" | "svg" | "option";
  }) => {
    const { data, height, theme, title, width, outputType } = params;

    // Transform data for ECharts funnel chart
    const funnelData = data.map((item) => ({
      name: item.category,
      value: item.value,
    }));

    const series: Array<SeriesOption> = [
      {
        type: "funnel",
        data: funnelData,
        left: "10%",
        top: 60,
        width: "80%",
        height: "80%",
        min: 0,
        max: Math.max(...data.map((item) => item.value)),
        minSize: "0%",
        maxSize: "100%",
        sort: "descending",
        gap: 2,
        label: {
          show: true,
          position: "inside",
          fontSize: 12,
          color: "#fff",
        },
        labelLine: {
          length: 10,
          lineStyle: {
            width: 1,
            type: "solid",
          },
        },
        itemStyle: {
          borderColor: "#fff",
          borderWidth: 1,
        },
        emphasis: {
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
      legend: {
        left: "center",
        orient: "horizontal",
        bottom: 10,
        data: funnelData.map((item) => item.name),
      },
    };

    return await generateChartImage(
      echartsOption,
      width,
      height,
      theme,
      outputType,
      "generate_funnel_chart",
    );
  },
};
