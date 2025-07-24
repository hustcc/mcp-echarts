import type { EChartsOption } from "echarts";
import { z } from "zod";
import { renderECharts } from "../utils/render";
import {
  CategoryFieldSchema,
  DataSchema,
  HeightSchema,
  SeriesFieldSchema,
  TitleSchema,
  ValueFieldSchema,
  WidthSchema,
} from "../utils/schema";

export const generateLineChartTool = {
  name: "generate_line_chart",
  description:
    "Generate a line chart based on structured data. Use this tool to display trends over a continuous interval or time.",
  inputSchema: z.object({
    data: DataSchema,
    categoryField: CategoryFieldSchema,
    valueField: ValueFieldSchema,
    seriesField: SeriesFieldSchema,
    title: TitleSchema,
    width: WidthSchema,
    height: HeightSchema,
    smooth: z
      .boolean()
      .optional()
      .default(false)
      .describe("Whether to use a smooth curve. Default is false."),
    showArea: z
      .boolean()
      .optional()
      .default(false)
      .describe("Whether to fill the area under the line. Default is false."),
    showSymbol: z
      .boolean()
      .optional()
      .default(true)
      .describe("Whether to show symbols on data points. Default is true."),
    stack: z
      .string()
      .optional()
      .describe(
        "Stack identifier. Lines with the same stack identifier will be stacked.",
      ),
  }),
  run: (params: {
    data: z.infer<typeof DataSchema>;
    categoryField: string;
    valueField: string;
    seriesField?: string;
    title?: string;
    width: number;
    height: number;
    smooth?: boolean;
    showArea?: boolean;
    showSymbol?: boolean;
    stack?: string;
  }) => {
    const {
      data,
      categoryField,
      valueField,
      seriesField,
      title,
      width,
      height,
      smooth,
      showArea,
      showSymbol,
      stack,
    } = params;

    const categories = [...new Set(data.map((item) => item[categoryField]))];
    const seriesData: EChartsOption["series"] = [];
    let legendData: string[] = [];

    if (seriesField) {
      // Multi-series chart
      legendData = [
        ...new Set(data.map((item) => item[seriesField])),
      ] as string[];
      for (const seriesName of legendData) {
        const seriesValues = categories.map((category) => {
          const item = data.find(
            (d) =>
              d[categoryField] === category && d[seriesField] === seriesName,
          );
          return item ? item[valueField] : null;
        });

        seriesData.push({
          name: seriesName,
          type: "line",
          data: seriesValues,
          smooth,
          showSymbol,
          areaStyle: showArea ? {} : undefined,
          stack,
        });
      }
    } else {
      // Single-series chart
      const seriesValues = categories.map((category) => {
        const item = data.find((d) => d[categoryField] === category);
        return item ? item[valueField] : null;
      });
      seriesData.push({
        type: "line",
        data: seriesValues,
        smooth,
        showSymbol,
        areaStyle: showArea ? {} : undefined,
        stack,
      });
    }

    const echartsOption: EChartsOption = {
      title: {
        text: title,
        left: "center",
      },
      tooltip: {
        trigger: "axis",
      },
      legend: {
        data: legendData,
        bottom: 10,
      },
      xAxis: {
        type: "category",
        data: categories,
        boundaryGap: false,
      },
      yAxis: {
        type: "value",
      },
      series: seriesData,
    };

    const imageBase64 = renderECharts(echartsOption, width, height);
    return {
      content: [
        {
          type: "image",
          data: imageBase64,
          mimeType: "image/png",
        },
      ],
    };
  },
};
