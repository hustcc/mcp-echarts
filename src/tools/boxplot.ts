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

// Boxplot chart data schema
const data = z.object({
  category: z
    .string()
    .describe("Category of the data point, such as 'Category A'."),
  value: z.number().describe("Value of the data point, such as 10."),
  group: z
    .string()
    .optional()
    .describe(
      "Optional group for the data point, used for grouping in the boxplot.",
    ),
});

export const generateBoxplotChartTool = {
  name: "generate_boxplot_chart",
  description:
    "Generate a boxplot chart to show data for statistical summaries among different categories, such as, comparing the distribution of data points across categories.",
  inputSchema: z.object({
    axisXTitle: AxisXTitleSchema,
    axisYTitle: AxisYTitleSchema,
    data: z
      .array(data)
      .describe(
        "Data for boxplot chart, such as, [{ category: 'Category A', value: 10 }, { category: 'Category B', value: 20, group: 'Group A' }].",
      )
      .nonempty({ message: "Boxplot chart data cannot be empty." }),
    height: HeightSchema,
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
      theme,
      title,
      width,
      outputType,
    } = params;

    // Group data by category and optional group
    const hasGroups = data.some((item) => item.group);

    let categories: string[] = [];
    const boxplotData: { name: string; value: number[] }[] = [];

    if (hasGroups) {
      // Group by category and group
      const groupMap = new Map<
        string,
        Array<{ category: string; value: number }>
      >();
      const categorySet = new Set<string>();

      for (const item of data) {
        const groupName = item.group || "Default";
        const key = `${item.category}_${groupName}`;
        if (!groupMap.has(key)) {
          groupMap.set(key, []);
        }
        groupMap.get(key)?.push(item);
        categorySet.add(item.category);
      }

      categories = Array.from(categorySet).sort();

      // Calculate boxplot statistics for each group
      groupMap.forEach((values, key) => {
        const [category, group] = key.split("_");
        const sortedValues = values.map((v) => v.value).sort((a, b) => a - b);
        const boxplotStats = calculateBoxplotStats(sortedValues);
        boxplotData.push({
          name: `${category}-${group}`,
          value: boxplotStats,
        });
      });
    } else {
      // Group by category only
      const categoryMap = new Map<string, number[]>();

      for (const item of data) {
        if (!categoryMap.has(item.category)) {
          categoryMap.set(item.category, []);
        }
        categoryMap.get(item.category)?.push(item.value);
      }

      categories = Array.from(categoryMap.keys()).sort();

      // Calculate boxplot statistics for each category
      for (const category of categories) {
        const values = categoryMap.get(category)?.sort((a, b) => a - b) || [];
        const boxplotStats = calculateBoxplotStats(values);
        boxplotData.push({
          name: category,
          value: boxplotStats,
        });
      }
    }

    const series: Array<SeriesOption> = [
      {
        type: "boxplot",
        data: boxplotData,
        itemStyle: {
          borderWidth: 2,
        },
        emphasis: {
          itemStyle: {
            borderWidth: 3,
            shadowBlur: 5,
            shadowColor: "rgba(0, 0, 0, 0.3)",
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
      xAxis: {
        type: "category",
        data: categories,
        name: axisXTitle,
        boundaryGap: true,
        nameGap: 30,
        splitArea: {
          show: false,
        },
        splitLine: {
          show: false,
        },
      },
      yAxis: {
        type: "value",
        name: axisYTitle,
        splitArea: {
          show: true,
        },
      },
    };

    // Helper function to calculate boxplot statistics
    function calculateBoxplotStats(values: number[]): number[] {
      const len = values.length;
      const min = values[0];
      const max = values[len - 1];

      const median =
        len % 2 === 0
          ? (values[len / 2 - 1] + values[len / 2]) / 2
          : values[Math.floor(len / 2)];

      const q1Index = Math.floor(len / 4);
      const q3Index = Math.floor((3 * len) / 4);
      const Q1 = values[q1Index];
      const Q3 = values[q3Index];

      return [min, Q1, median, Q3, max];
    }

    return await generateChartImage(
      echartsOption,
      width,
      height,
      theme,
      outputType,
      "generate_boxplot_chart",
    );
  },
};
