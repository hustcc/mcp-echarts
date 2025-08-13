import type { EChartsOption, SeriesOption } from "echarts";
import { z } from "zod";
import { generateChartImage } from "../utils";
import {
  AxisXTitleSchema,
  AxisYTitleSchema,
  HeightSchema,
  OutputTypeSchema,
  ThemeSchema,
  TitleSchema,
  WidthSchema,
} from "../utils/schema";

// Line chart data schema
const data = z.object({
  group: z
    .string()
    .optional()
    .describe("Group name for multiple series, required when stack is enabled"),
  time: z.string(),
  value: z.number(),
});

export const generateLineChartTool = {
  name: "generate_line_chart",
  description:
    "Generate a line chart to show trends over time, such as, the ratio of Apple computer sales to Apple's profits changed from 2000 to 2016.",
  inputSchema: z.object({
    axisXTitle: AxisXTitleSchema,
    axisYTitle: AxisYTitleSchema,
    data: z
      .array(data)
      .describe(
        "Data for line chart, such as, [{ time: '2015', value: 23 }, { time: '2016', value: 32 }]. For multiple series: [{ group: 'Series A', time: '2015', value: 23 }, { group: 'Series B', time: '2015', value: 18 }].",
      )
      .nonempty({ message: "Line chart data cannot be empty." }),
    height: HeightSchema,
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
    smooth: z
      .boolean()
      .optional()
      .default(false)
      .describe("Whether to use a smooth curve. Default is false."),
    stack: z
      .boolean()
      .optional()
      .default(false)
      .describe(
        "Whether stacking is enabled. When enabled, line charts require a 'group' field in the data.",
      ),
    theme: ThemeSchema,
    title: TitleSchema,
    width: WidthSchema,
    outputType: OutputTypeSchema,
  }),
  run: (params: {
    axisXTitle?: string;
    axisYTitle?: string;
    data: Array<{ time: string; value: number; group?: string }>;
    height: number;
    showArea?: boolean;
    showSymbol?: boolean;
    smooth?: boolean;
    stack?: boolean;
    theme?: "default" | "dark";
    title?: string;
    width: number;
    outputType?: "png" | "svg" | "option";
  }) => {
    const {
      axisXTitle,
      axisYTitle,
      data,
      height,
      showArea,
      showSymbol,
      smooth,
      stack,
      theme,
      title,
      width,
      outputType,
    } = params;

    // Check if data has group field for multiple series
    const hasGroups = data.some((item) => item.group);

    let series: Array<SeriesOption> = [];
    let categories: string[] = [];

    if (hasGroups) {
      // Handle multiple series data
      const groupMap = new Map<
        string,
        Array<{ time: string; value: number }>
      >();
      const timeSet = new Set<string>();

      // Group data by group field and collect all time points
      for (const item of data) {
        const groupName = item.group || "Default";
        if (!groupMap.has(groupName)) {
          groupMap.set(groupName, []);
        }
        const groupData = groupMap.get(groupName);
        if (groupData) {
          groupData.push({ time: item.time, value: item.value });
        }
        timeSet.add(item.time);
      }

      // Sort time points
      categories = Array.from(timeSet).sort();

      // Create series for each group
      groupMap.forEach((groupData, groupName) => {
        // Create a map for quick lookup
        const dataMap = new Map(groupData.map((d) => [d.time, d.value]));

        // Fill values for all time points (null for missing data)
        const values = categories.map((time) => dataMap.get(time) ?? null);

        series.push({
          areaStyle: showArea ? {} : undefined,
          connectNulls: false,
          data: values,
          name: groupName,
          showSymbol,
          smooth,
          stack: stack ? "Total" : undefined,
          type: "line",
        });
      });
    } else {
      // Handle single series data
      categories = data.map((item) => item.time);
      const values = data.map((item) => item.value);

      series = [
        {
          areaStyle: showArea ? {} : undefined,
          data: values,
          showSymbol,
          smooth,
          stack: stack ? "Total" : undefined,
          type: "line",
        },
      ];
    }

    const echartsOption: EChartsOption = {
      legend: hasGroups
        ? {
            left: "center",
            orient: "horizontal",
            bottom: 10,
          }
        : undefined,
      series,
      title: {
        left: "center",
        text: title,
      },
      tooltip: {
        trigger: "axis",
      },
      xAxis: {
        boundaryGap: false,
        data: categories,
        name: axisXTitle,
        type: "category",
      },
      yAxis: {
        name: axisYTitle,
        type: "value",
      },
    };

    return generateChartImage(
      echartsOption,
      width,
      height,
      theme,
      outputType,
      "generate_line_chart",
    );
  },
};
