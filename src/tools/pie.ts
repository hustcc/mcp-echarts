import type { EChartsOption, SeriesOption } from "echarts";
import { z } from "zod";
import { renderECharts } from "../utils/render";
import {
  HeightSchema,
  ThemeSchema,
  TitleSchema,
  WidthSchema,
} from "../utils/schema";

// Pie chart data schema
const data = z.object({
  category: z
    .string()
    .describe("Category of the data point, such as '分类一'."),
  value: z.number().describe("Value of the data point, such as 27."),
});

export const generatePieChartTool = {
  name: "generate_pie_chart",
  description:
    "Generate a pie chart to show the proportion of parts, such as, market share and budget allocation.",
  inputSchema: z.object({
    data: z
      .array(data)
      .describe(
        "Data for pie chart, such as, [{ category: '分类一', value: 27 }, { category: '分类二', value: 25 }].",
      )
      .nonempty({ message: "Pie chart data cannot be empty." }),
    height: HeightSchema,
    innerRadius: z
      .number()
      .default(0)
      .describe(
        "Set the innerRadius of pie chart, the value between 0 and 1. Set the pie chart as a donut chart. Set the value to 0.6 or number in [0 ,1] to enable it.",
      ),
    theme: ThemeSchema,
    title: TitleSchema,
    width: WidthSchema,
  }),
  run: (params: {
    data: Array<{ category: string; value: number }>;
    height: number;
    innerRadius?: number;
    theme?: "default" | "dark";
    title?: string;
    width: number;
  }) => {
    const { data, height, innerRadius = 0, theme, title, width } = params;

    // Transform data for ECharts
    const pieData = data.map((item) => ({
      name: item.category,
      value: item.value,
    }));

    const series: Array<SeriesOption> = [
      {
        data: pieData,
        radius: innerRadius > 0 ? [`${innerRadius * 100}%`, "70%"] : "70%",
        type: "pie",
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ];

    const echartsOption: EChartsOption = {
      legend: {
        left: "center",
        orient: "horizontal",
        top: "bottom",
      },
      series,
      title: {
        left: "center",
        text: title,
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} ({d}%)",
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
