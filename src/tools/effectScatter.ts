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

// Effect scatter chart data schema
const data = z.object({
  x: z.number().describe("X coordinate value of the data point."),
  y: z.number().describe("Y coordinate value of the data point."),
  value: z.number().describe("Value determines the size and effect intensity."),
});

export const generateEffectScatterChartTool = {
  name: "generate_effectScatter_chart",
  description:
    "Generate an effect scatter chart with ripple animation effects, such as, highlighting important data points or showing dynamic data changes.",
  inputSchema: z.object({
    axisXTitle: AxisXTitleSchema,
    axisYTitle: AxisYTitleSchema,
    data: z
      .array(data)
      .describe(
        "Data for effect scatter chart, such as, [{ x: 10, y: 15, value: 20 }, { x: 20, y: 25, value: 30 }].",
      )
      .nonempty({ message: "Effect scatter chart data cannot be empty." }),
    height: HeightSchema,
    theme: ThemeSchema,
    title: TitleSchema,
    width: WidthSchema,
  }),
  run: (params: {
    axisXTitle?: string;
    axisYTitle?: string;
    data: Array<{ x: number; y: number; value: number }>;
    height: number;
    theme?: "default" | "dark";
    title?: string;
    width: number;
  }) => {
    const { axisXTitle, axisYTitle, data, height, theme, title, width } =
      params;

    // Transform data for ECharts effect scatter
    const effectScatterData = data.map((item) => [item.x, item.y, item.value]);

    const series: Array<SeriesOption> = [
      {
        type: "effectScatter",
        data: effectScatterData,
        symbolSize: (val: number[]) => Math.sqrt(val[2]) * 5,
        showEffectOn: "render",
        rippleEffect: {
          brushType: "stroke",
        },

        itemStyle: {
          color: "#f4e925",
          shadowBlur: 10,
          shadowColor: "#333",
        },
        emphasis: {
          scale: true,
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
      xAxis: {
        name: axisXTitle,
        type: "value",
        scale: true,
        splitLine: {
          lineStyle: {
            type: "dashed",
          },
        },
      },
      yAxis: {
        name: axisYTitle,
        type: "value",
        scale: true,
        splitLine: {
          lineStyle: {
            type: "dashed",
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
