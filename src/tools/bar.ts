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

// Bar chart data schema
const data = z.object({
  category: z
    .string()
    .describe("Category of the data point, such as 'Category A'."),
  value: z.number().describe("Value of the data point, such as 10."),
  group: z
    .string()
    .optional()
    .describe("Group name for multiple series, used for grouping or stacking"),
});

export const generateBarChartTool = {
  name: "generate_bar_chart",
  description:
    "Generate a bar chart to show data for numerical comparisons among different categories, such as, comparing categorical data and for horizontal comparisons.",
  inputSchema: z.object({
    axisXTitle: AxisXTitleSchema,
    axisYTitle: AxisYTitleSchema,
    data: z
      .array(data)
      .describe(
        "Data for bar chart, such as, [{ category: 'Category A', value: 10 }, { category: 'Category B', value: 20 }] or [{ category: 'Category A', value: 10, group: 'Group A' }].",
      )
      .nonempty({ message: "Bar chart data cannot be empty." }),
    height: HeightSchema,
    group: z
      .boolean()
      .optional()
      .default(false)
      .describe(
        "Whether grouping is enabled. When enabled, bar charts require a 'group' field in the data. When `group` is true, `stack` should be false.",
      ),
    stack: z
      .boolean()
      .optional()
      .default(false)
      .describe(
        "Whether stacking is enabled. When enabled, bar charts require a 'group' field in the data. When `stack` is true, `group` should be false.",
      ),

    theme: ThemeSchema,
    title: TitleSchema,
    width: WidthSchema,
    outputType: OutputTypeSchema,
  }),
  run: async (params: {
    axisXTitle?: string;
    axisYTitle?: string;
    data: Array<{ category: string; value: number; group?: string }>;
    height: number;
    group?: boolean;
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
      group = false,
      stack = false,
      theme,
      title,
      width,
      outputType,
    } = params;

    // Check if data has group field for multiple series
    const hasGroups = data.some((item) => item.group);

    let series: Array<SeriesOption> = [];
    let categories: string[] = [];

    if (hasGroups && (group || stack)) {
      // Handle multiple series data (grouped or stacked)
      const groupMap = new Map<
        string,
        Array<{ category: string; value: number }>
      >();
      const categorySet = new Set<string>();

      // Group data by group field and collect all categories
      for (const item of data) {
        const groupName = item.group || "Default";
        if (!groupMap.has(groupName)) {
          groupMap.set(groupName, []);
        }
        const groupData = groupMap.get(groupName);
        if (groupData) {
          groupData.push({ category: item.category, value: item.value });
        }
        categorySet.add(item.category);
      }

      // Sort categories
      categories = Array.from(categorySet).sort();

      // Create series for each group
      groupMap.forEach((groupData, groupName) => {
        // Create a map for quick lookup
        const dataMap = new Map(groupData.map((d) => [d.category, d.value]));

        // Fill values for all categories (0 for missing data)
        const values = categories.map((category) => dataMap.get(category) ?? 0);

        series.push({
          data: values,
          name: groupName,
          stack: stack ? "Total" : undefined,
          type: "bar",
        });
      });
    } else {
      // Handle single series data
      categories = data.map((item) => item.category);
      const values = data.map((item) => item.value);

      series = [
        {
          data: values,
          type: "bar",
        },
      ];
    }

    const echartsOption: EChartsOption = {
      legend:
        hasGroups && (group || stack)
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
        data: categories,
        name: axisXTitle,
        type: "category",
      },
      yAxis: {
        name: axisYTitle,
        type: "value",
      },
    };

    return await generateChartImage(
      echartsOption,
      width,
      height,
      theme,
      outputType,
      "generate_bar_chart",
    );
  },
};
