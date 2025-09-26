import { z } from "zod";
import { generateLineChartTool } from "./line";

// Extends generateLineChartTool implementation since area charts are line charts with area fill enabled
export const generateAreaChartTool = {
  ...generateLineChartTool,
  name: "generate_area_chart",
  description:
    "Generate an area chart to show data trends under continuous independent variables and observe the overall data trend, such as, displacement = velocity (average or instantaneous) × time: s = v × t. If the x-axis is time (t) and the y-axis is velocity (v) at each moment, an area chart allows you to observe the trend of velocity over time and infer the distance traveled by the area's size.",
  inputSchema: generateLineChartTool.inputSchema.extend({
    data: z
      .array(
        z.object({
          group: z
            .string()
            .optional()
            .describe(
              "Group name for multiple series, required when stack is enabled",
            ),
          time: z.string(),
          value: z.number(),
        }),
      )
      .describe(
        "Data for area chart, such as, [{ time: '2015', value: 23 }, { time: '2016', value: 32 }]. For multiple series: [{ group: 'Series A', time: '2015', value: 23 }, { group: 'Series B', time: '2015', value: 18 }].",
      )
      .nonempty({ message: "Area chart data cannot be empty." }),
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
    // Force showArea to true for area chart
    return generateLineChartTool.run({
      ...params,
      showArea: true,
    });
  },
};
