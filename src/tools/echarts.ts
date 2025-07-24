import { z } from "zod";
import { renderECharts } from "../utils";

function isValidEChartsOption(option: string): boolean {
  try {
    const parsedOption = JSON.parse(option);
    return typeof parsedOption === "object" && parsedOption !== null;
  } catch {
    return false;
  }
}

export const generateEChartsTool = {
  name: "generate_echarts",
  description:
    "Generate visual charts using Apache ECharts with echarts option and configuration dynamically. Apache ECharts is an Open Source JavaScript Visualization Library, which is used to create interactive charts and visualizations in web applications. It supports a wide range of chart types, including line charts, bar charts, pie charts, scatter plots, and more. ECharts is highly customizable and can be integrated with various data sources to create dynamic visualizations.",
  inputSchema: z.object({
    echartsOption: z
      .string()
      .describe(
        `ECharts option and configuration used to generate charts. For example:
{
  "title": {
    "text": "ECharts Entry Example",
    "left": "center",
    "top": "2%"
  },
  "tooltip": {},
  "xAxis": {
    "data": ["shirt", "cardigan", "chiffon", "pants", "heels", "socks"]
  },
  "yAxis": {},
  "series": [{
    "name": "Sales",
    "type": "bar",
    "data": [5, 20, 36, 10, 10, 20]
  }]
}

ATTENTION: A valid ECharts option must be a valid JSON string, and cannot be empty.
`,
      )
      .nonempty({
        message:
          "A valid ECharts option must be a valid JSON string, and cannot be empty.",
      }),
    width: z
      .number()
      .describe("The width of the ECharts in pixels. Default is 800.")
      .optional()
      .default(800),
    height: z
      .number()
      .describe("The height of the ECharts in pixels. Default is 600.")
      .optional()
      .default(600),
    theme: z
      .enum(["default", "dark"])
      .describe("ECharts theme, optional. Default is 'default'.")
      .optional()
      .default("default"),
    outputType: z
      .enum(["png", "svg", "option"])
      .describe(
        "The output type of the diagram. Can be 'png', 'svg' or 'option'. Default is 'png', 'png' will return the rendered PNG image, 'svg' will return the rendered SVG string, and 'option' will return the valid ECharts option.",
      )
      .optional()
      .default("png"),
  }),
  run: (params: {
    echartsOption: string;
    width?: number;
    height?: number;
    theme?: "default" | "dark";
    outputType?: "png" | "svg" | "option";
  }) => {
    const { width, height, echartsOption, theme, outputType } = params;

    if (!isValidEChartsOption(echartsOption)) {
      throw new Error(
        "Invalid ECharts option, a valid ECharts option must be a valid JSON string, and cannot be empty.",
      );
    }

    const option = JSON.parse(echartsOption);

    const r = renderECharts(option, width, height, theme, outputType);

    const isImage = outputType !== "svg" && outputType !== "option";

    const result = isImage
      ? {
          type: "image",
          data: r,
          mimeType: "image/png",
        }
      : {
          type: "text",
          text: r,
        };

    return {
      content: [result],
    };
  },
};
