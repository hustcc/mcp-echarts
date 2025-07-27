import type { EChartsOption, SeriesOption } from "echarts";
import { z } from "zod";
import { renderECharts } from "../utils/render";
import {
  HeightSchema,
  ThemeSchema,
  TitleSchema,
  WidthSchema,
} from "../utils/schema";

// Funnel chart data schema
const data = z.object({
  category: z.string().describe("Stage category name, such as '浏览网站'."),
  value: z.number().describe("Value at this stage, such as 50000."),
});

export const generateFunnelChartTool = {
  name: "generate_funnel_chart",
  description:
    "Generate a funnel chart to visualize the progressive reduction of data as it passes through stages, such as, the conversion rates of users from visiting a website to completing a purchase.",
  inputSchema: z.object({
    data: z
      .array(data)
      .describe(
        "Data for funnel chart, such as, [{ category: '浏览网站', value: 50000 }, { category: '放入购物车', value: 35000 }, { category: '生成订单', value: 25000 }].",
      )
      .nonempty({ message: "Funnel chart data cannot be empty." }),
    height: HeightSchema,
    theme: ThemeSchema,
    title: TitleSchema,
    width: WidthSchema,
  }),
  run: (params: {
    data: Array<{ category: string; value: number }>;
    height: number;
    theme?: "default" | "dark";
    title?: string;
    width: number;
  }) => {
    const { data, height, theme, title, width } = params;

    // Transform data for ECharts funnel chart
    const funnelData = data.map((item) => ({
      name: item.category,
      value: item.value,
    }));

    const series: Array<SeriesOption> = [
      {
        type: "funnel",
        data: funnelData,
        left: "10%",
        top: 60,
        width: "80%",
        height: "80%",
        min: 0,
        max: Math.max(...data.map((item) => item.value)),
        minSize: "0%",
        maxSize: "100%",
        sort: "descending",
        gap: 2,
        label: {
          show: true,
          position: "inside",
          fontSize: 12,
          color: "#fff",
        },
        labelLine: {
          length: 10,
          lineStyle: {
            width: 1,
            type: "solid",
          },
        },
        itemStyle: {
          borderColor: "#fff",
          borderWidth: 1,
        },
        emphasis: {
          label: {
            fontSize: 16,
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
      legend: {
        orient: "vertical",
        left: "left",
        data: funnelData.map((item) => item.name),
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
