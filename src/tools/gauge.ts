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

// Gauge chart data schema
const data = z.object({
  name: z.string().describe("Indicator name, such as 'CPU Usage'."),
  value: z.number().describe("Current value of the indicator, such as 75."),
});

export const generateGaugeChartTool = {
  name: "generate_gauge_chart",
  description:
    "Generate a gauge chart to display single indicator's current status, such as, CPU usage rate, completion progress, or performance scores.",
  inputSchema: z.object({
    data: z
      .array(data)
      .describe(
        "Data for gauge chart, such as, [{ name: 'CPU Usage', value: 75 }]. Multiple gauges can be displayed.",
      )
      .nonempty({ message: "Gauge chart data cannot be empty." }),
    height: HeightSchema,
    max: z
      .number()
      .optional()
      .default(100)
      .describe("Maximum value of the gauge, default is 100."),
    min: z
      .number()
      .optional()
      .default(0)
      .describe("Minimum value of the gauge, default is 0."),
    theme: ThemeSchema,
    title: TitleSchema,
    width: WidthSchema,
    outputType: OutputTypeSchema,
  }),
  run: async (params: {
    data: Array<{ name: string; value: number }>;
    height: number;
    max?: number;
    min?: number;
    theme?: "default" | "dark";
    title?: string;
    width: number;
    outputType?: "png" | "svg" | "option";
  }) => {
    const {
      data,
      height,
      max = 100,
      min = 0,
      theme,
      title,
      width,
      outputType,
    } = params;

    // For multiple gauges, arrange them horizontally
    const series: Array<SeriesOption> = data.map((item, index) => {
      const isMultiple = data.length > 1;

      return {
        name: item.name,
        type: "gauge",
        data: [{ name: item.name, value: item.value }],
        center: isMultiple
          ? [`${(100 / (data.length + 1)) * (index + 1)}%`, "60%"]
          : ["50%", "55%"],
        radius: isMultiple ? `${Math.min(80 / data.length, 30)}%` : "80%",
        min: min,
        max: max,
        startAngle: 180,
        endAngle: 0,
        axisLine: {
          lineStyle: {
            width: 6,
            color: [
              [0.3, "#67e0e3"],
              [0.7, "#37a2da"],
              [1, "#fd666d"],
            ],
          },
        },
        pointer: {
          itemStyle: {
            color: "inherit",
          },
        },
        axisTick: {
          distance: -30,
          length: 8,
          lineStyle: {
            color: "#fff",
            width: 2,
          },
        },
        splitLine: {
          distance: -30,
          length: 30,
          lineStyle: {
            color: "#fff",
            width: 4,
          },
        },
        axisLabel: {
          color: "inherit",
          distance: 40,
          fontSize: isMultiple ? 10 : 12,
        },
        detail: {
          valueAnimation: true,
          formatter: "{value}",
          color: "inherit",
          fontSize: isMultiple ? 16 : 20,
          offsetCenter: [0, "30%"],
        },
        title: {
          offsetCenter: [0, "50%"],
          fontSize: isMultiple ? 12 : 14,
        },
      };
    });

    const echartsOption: EChartsOption = {
      legend:
        data.length > 1
          ? {
              bottom: 10,
              left: "center",
              orient: "horizontal",
              data: data.map((item) => item.name),
            }
          : undefined,
      series,
      title: {
        left: "center",
        text: title,
        top: data.length > 1 ? "5%" : undefined,
      },
    };

    return await generateChartImage(
      echartsOption,
      width,
      height,
      theme,
      outputType,
      "generate_gauge_chart",
    );
  },
};
