import type { EChartsOption, SeriesOption } from "echarts";
import { z } from "zod";
import { renderECharts } from "../utils/render";
import {
  HeightSchema,
  ThemeSchema,
  TitleSchema,
  WidthSchema,
} from "../utils/schema";

// Theme river chart data schema
const data = z.object({
  date: z.string().describe("Date string, such as '2023-01-01'."),
  value: z.number().describe("Value at this date, such as 100."),
  name: z.string().describe("Category or series name, such as 'Category A'."),
});

export const generateThemeRiverChartTool = {
  name: "generate_themeRiver_chart",
  description:
    "Generate a theme river chart to show changes in data over time across different categories, such as, showing trends of different topics or categories flowing over time.",
  inputSchema: z.object({
    data: z
      .array(data)
      .describe(
        "Data for theme river chart, such as, [{ date: '2023-01-01', value: 100, name: 'Category A' }].",
      )
      .nonempty({ message: "Theme river chart data cannot be empty." }),
    height: HeightSchema,
    theme: ThemeSchema,
    title: TitleSchema,
    width: WidthSchema,
  }),
  run: (params: {
    data: Array<{ date: string; value: number; name: string }>;
    height: number;
    theme?: "default" | "dark";
    title?: string;
    width: number;
  }) => {
    const { data, height, theme, title, width } = params;

    // Extract unique dates and categories
    const dates = Array.from(new Set(data.map((item) => item.date))).sort();
    const categories = Array.from(new Set(data.map((item) => item.name)));

    // Transform data for theme river format
    const themeRiverData = data.map(
      (item) => [item.date, item.value, item.name] as [string, number, string],
    );

    const series: Array<SeriesOption> = [
      {
        type: "themeRiver",
        data: themeRiverData,
        emphasis: {
          itemStyle: {
            shadowBlur: 20,
            shadowColor: "rgba(0, 0, 0, 0.8)",
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
        triggerOn: "mousemove",
      },
      legend: {
        data: categories,
        bottom: 10,
      },
      singleAxis: {
        top: 50,
        bottom: 50,
        axisTick: {},
        axisLabel: {},
        type: "time",
        axisPointer: {
          animation: true,
          label: {
            show: true,
          },
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: "dashed",
            opacity: 0.2,
          },
        },
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
