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

// Candlestick chart data schema
const data = z.object({
  date: z.string().describe("Date string, such as '2023-01-01'."),
  open: z.number().describe("Opening price."),
  high: z.number().describe("Highest price."),
  low: z.number().describe("Lowest price."),
  close: z.number().describe("Closing price."),
  volume: z.number().optional().describe("Trading volume (optional)."),
});

export const generateCandlestickChartTool = {
  name: "generate_candlestick_chart",
  description:
    "Generate a candlestick chart for financial data visualization, such as, stock prices, cryptocurrency prices, or other OHLC (Open-High-Low-Close) data.",
  inputSchema: z.object({
    data: z
      .array(data)
      .describe(
        "Data for candlestick chart, such as, [{ date: '2023-01-01', open: 100, high: 110, low: 95, close: 105, volume: 10000 }].",
      )
      .nonempty({ message: "Candlestick chart data cannot be empty." }),
    height: HeightSchema,
    showVolume: z
      .boolean()
      .optional()
      .default(false)
      .describe(
        "Whether to show volume chart below candlestick. Default is false.",
      ),
    theme: ThemeSchema,
    title: TitleSchema,
    width: WidthSchema,
    outputType: OutputTypeSchema,
  }),
  run: async (params: {
    data: Array<{
      date: string;
      open: number;
      high: number;
      low: number;
      close: number;
      volume?: number;
    }>;
    height: number;
    showVolume?: boolean;
    theme?: "default" | "dark";
    title?: string;
    width: number;
    outputType?: "png" | "svg" | "option";
  }) => {
    const {
      data,
      height,
      showVolume = false,
      theme,
      title,
      width,
      outputType,
    } = params;

    // Sort data by date
    const sortedData = [...data].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    // Extract dates and OHLC data
    const dates = sortedData.map((item) => item.date);
    const ohlcData = sortedData.map((item) => [
      item.open,
      item.close,
      item.low,
      item.high,
    ]);
    const volumeData = sortedData.map((item) => item.volume || 0);

    const series: Array<SeriesOption> = [
      {
        name: "Candlestick",
        type: "candlestick",
        data: ohlcData,
        itemStyle: {
          color: "#ef232a",
          color0: "#14b143",
          borderColor: "#ef232a",
          borderColor0: "#14b143",
        },
        emphasis: {
          itemStyle: {
            color: "#ef232a",
            color0: "#14b143",
            borderColor: "#ef232a",
            borderColor0: "#14b143",
          },
        },
      },
    ];

    // Add volume series if requested
    if (showVolume && volumeData.some((v) => v > 0)) {
      series.push({
        name: "Volume",
        type: "bar",
        xAxisIndex: 1,
        yAxisIndex: 1,
        data: volumeData,
        barWidth: "60%",
        itemStyle: {
          color: (params: { dataIndex: number }) => {
            const dataIndex = params.dataIndex;
            return sortedData[dataIndex].close >= sortedData[dataIndex].open
              ? "#ef232a"
              : "#14b143";
          },
        },
      });
    }

    const echartsOption: EChartsOption = {
      animation: false,
      legend: {
        bottom: 10,
        left: "center",
        data: showVolume ? ["Candlestick", "Volume"] : ["Candlestick"],
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
        },
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        textStyle: {
          color: "#000",
        },
      },
      xAxis: [
        {
          type: "category",
          data: dates,
          boundaryGap: true,
          axisLine: { onZero: false },
          splitLine: { show: false },
          min: -0.2,
          max: dates.length - 0.8,
        },
        ...(showVolume
          ? [
              {
                type: "category" as const,
                gridIndex: 1,
                data: dates,
                boundaryGap: true,
                axisLine: { onZero: false },
                axisTick: { show: false },
                splitLine: { show: false },
                axisLabel: { show: false },
                min: -0.2,
                max: dates.length - 0.8,
              },
            ]
          : []),
      ],
      yAxis: [
        {
          scale: true,
          splitArea: {
            show: true,
          },
        },
        ...(showVolume
          ? [
              {
                scale: true,
                gridIndex: 1,
                splitNumber: 2,
                axisLabel: { show: false },
                axisLine: { show: false },
                axisTick: { show: false },
                splitLine: { show: false },
                min: 0,
              },
            ]
          : []),
      ],
      grid: showVolume
        ? [
            {
              left: "12%",
              right: "10%",
              top: "15%",
              height: "50%",
            },
            {
              left: "12%",
              right: "10%",
              top: "75%",
              height: "15%",
            },
          ]
        : [
            {
              left: "12%",
              right: "10%",
              top: "15%",
              bottom: "15%",
            },
          ],
      series,
      title: {
        left: "center",
        text: title,
      },
    };

    return await generateChartImage(
      echartsOption,
      width,
      height,
      theme,
      outputType,
      "generate_candlestick_chart",
    );
  },
};
