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

// Radar chart data schema
const data = z.object({
  name: z.string().describe("Dimension name, such as 'Design'."),
  value: z.number().describe("Value of the dimension, such as 70."),
  group: z
    .string()
    .optional()
    .describe(
      "Group name for multiple series, used for comparing different entities",
    ),
});

export const generateRadarChartTool = {
  name: "generate_radar_chart",
  description:
    "Generate a radar chart to display multidimensional data (four dimensions or more), such as, evaluate Huawei and Apple phones in terms of five dimensions: ease of use, functionality, camera, benchmark scores, and battery life.",
  inputSchema: z.object({
    data: z
      .array(data)
      .describe(
        "Data for radar chart, such as, [{ name: 'Design', value: 70 }, { name: 'Performance', value: 85 }] or [{ name: 'Design', value: 70, group: 'iPhone' }].",
      )
      .nonempty({ message: "Radar chart data cannot be empty." }),
    height: HeightSchema,
    theme: ThemeSchema,
    title: TitleSchema,
    width: WidthSchema,
    outputType: OutputTypeSchema,
  }),
  run: async (params: {
    data: Array<{ name: string; value: number; group?: string }>;
    height: number;
    theme?: "default" | "dark";
    title?: string;
    width: number;
    outputType?: "png" | "svg" | "option";
  }) => {
    const { data, height, theme, title, width, outputType } = params;

    // Check if data has group field for multiple series
    const hasGroups = data.some((item) => item.group);

    // Collect all unique dimensions
    const dimensionSet = new Set<string>();
    for (const item of data) {
      dimensionSet.add(item.name);
    }
    const dimensions = Array.from(dimensionSet).sort();

    // Create radar indicator configuration
    // Calculate the maximum value for all dimensions, then use the same max value to avoid alignTicks warning
    const allValues = data.map((item) => item.value);
    const globalMaxValue = Math.max(...allValues);
    const unifiedMax = Math.ceil((globalMaxValue * 1.2) / 10) * 10;

    const indicator = dimensions.map((name) => ({
      name,
      max: unifiedMax,
    }));

    let series: Array<SeriesOption> = [];

    if (hasGroups) {
      // Handle multiple series data (grouped)
      const groupMap = new Map<
        string,
        Array<{ name: string; value: number }>
      >();

      // Group data by group field
      for (const item of data) {
        const groupName = item.group || "Default";
        if (!groupMap.has(groupName)) {
          groupMap.set(groupName, []);
        }
        const groupData = groupMap.get(groupName);
        if (groupData) {
          groupData.push({ name: item.name, value: item.value });
        }
      }

      // Create series data for each group
      const seriesData = Array.from(groupMap.entries()).map(
        ([groupName, groupData]) => {
          // Create a map for quick lookup
          const dataMap = new Map(groupData.map((d) => [d.name, d.value]));

          // Fill values for all dimensions (0 for missing data)
          const values = dimensions.map(
            (dimension) => dataMap.get(dimension) ?? 0,
          );

          return {
            name: groupName,
            value: values,
          };
        },
      );

      series = [
        {
          data: seriesData,
          type: "radar",
        },
      ];
    } else {
      // Handle single series data
      const dataMap = new Map(data.map((d) => [d.name, d.value]));
      const values = dimensions.map((dimension) => dataMap.get(dimension) ?? 0);

      series = [
        {
          data: [
            {
              value: values,
              name: title || "Data",
            },
          ],
          type: "radar",
        },
      ];
    }

    const echartsOption: EChartsOption = {
      legend: hasGroups
        ? {
            left: "center",
            orient: "horizontal",
            bottom: "5%",
          }
        : undefined,
      radar: {
        indicator,
        radius: "60%",
        splitNumber: 4,
        axisName: {
          formatter: "{value}",
          color: "#666",
        },
        splitArea: {
          areaStyle: {
            color: ["rgba(250, 250, 250, 0.3)", "rgba(200, 200, 200, 0.3)"],
          },
        },
      },
      series,
      title: {
        left: "center",
        text: title,
        top: "5%",
      },
      tooltip: {
        trigger: "item",
      },
    };

    return await generateChartImage(
      echartsOption,
      width,
      height,
      theme,
      outputType,
      "generate_radar_chart",
    );
  },
};
