import type { EChartsOption, SeriesOption } from "echarts";
import { z } from "zod";
import { renderECharts } from "../utils/render";
import {
  AxisXTitleSchema,
  AxisYTitleSchema,
  HeightSchema,
  ThemeSchema,
  TitleSchema,
  WidthSchema,
} from "../utils/schema";

// Pictorial bar chart data schema
const data = z.object({
  category: z.string().describe("Category name, such as '分类一'."),
  value: z.number().describe("Value of the data point, such as 10."),
  symbol: z
    .string()
    .optional()
    .describe(
      "Symbol for this bar, such as 'circle', 'rect', 'triangle'. Default is 'rect'.",
    ),
});

export const generatePictorialBarChartTool = {
  name: "generate_pictorialBar_chart",
  description:
    "Generate a pictorial bar chart to display data using custom symbols and shapes, such as, visualizing data with icons or custom graphics.",
  inputSchema: z.object({
    axisXTitle: AxisXTitleSchema,
    axisYTitle: AxisYTitleSchema,
    data: z
      .array(data)
      .describe(
        "Data for pictorial bar chart, such as, [{ category: '分类一', value: 10, symbol: 'circle' }].",
      )
      .nonempty({ message: "Pictorial bar chart data cannot be empty." }),
    height: HeightSchema,
    theme: ThemeSchema,
    title: TitleSchema,
    width: WidthSchema,
  }),
  run: (params: {
    axisXTitle?: string;
    axisYTitle?: string;
    data: Array<{ category: string; value: number; symbol?: string }>;
    height: number;
    theme?: "default" | "dark";
    title?: string;
    width: number;
  }) => {
    const { axisXTitle, axisYTitle, data, height, theme, title, width } =
      params;

    // Extract categories and values
    const categories = data.map((item) => item.category);
    const values = data.map((item) => ({
      value: item.value,
      symbol: item.symbol || "rect",
      symbolSize: ["100%", "100%"],
      symbolPosition: "start" as const,
      symbolOffset: [0, 0],
    }));

    const series: Array<SeriesOption> = [
      {
        type: "pictorialBar",
        data: values,
        barWidth: "60%",
        itemStyle: {
          color: "#4a90e2",
        },
        emphasis: {
          itemStyle: {
            opacity: 0.8,
          },
        },
        animationEasing: "elasticOut",
        animationDelayUpdate: (idx: number) => idx * 5,
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
      xAxis: {
        type: "category",
        data: categories,
        name: axisXTitle,
        axisLine: {
          show: true,
          lineStyle: {
            color: "#999",
          },
        },
        axisTick: {
          show: false,
        },
      },
      yAxis: {
        type: "value",
        name: axisYTitle,
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          lineStyle: {
            color: "#e6e6e6",
            type: "dashed",
          },
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
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
