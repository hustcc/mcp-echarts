import { describe, expect, it } from "vitest";
import { generateEChartsTool } from "../../src/tools/echarts";
import { TEST_CONFIG, extractImageBuffer } from "../utils/matcher";

describe("ECharts Tool", () => {
  it("should generate chart from ECharts option JSON string", async () => {
    const echartsOption = JSON.stringify({
      title: {
        text: "Custom ECharts Example",
        left: "center",
      },
      tooltip: {},
      xAxis: {
        data: ["shirt", "cardigan", "chiffon", "pants", "heels", "socks"],
      },
      yAxis: {},
      series: [
        {
          name: "Sales",
          type: "bar",
          data: [5, 20, 36, 10, 10, 20],
        },
      ],
    });

    const result = await generateEChartsTool.run({
      echartsOption,
      width: TEST_CONFIG.defaultWidth,
      height: TEST_CONFIG.defaultHeight,
      theme: TEST_CONFIG.defaultTheme,
    });

    const buffer = extractImageBuffer(result);
    await expect(buffer).toImageEqual(TEST_CONFIG.outputDir, "echarts-custom", {
      maxError: TEST_CONFIG.defaultMaxError,
    });
  });

  it("should generate pie chart using ECharts option", async () => {
    const echartsOption = JSON.stringify({
      title: {
        text: "Pie Chart via ECharts Tool",
        left: "center",
      },
      tooltip: {
        trigger: "item",
      },
      legend: {
        orient: "vertical",
        left: "left",
      },
      series: [
        {
          name: "Access From",
          type: "pie",
          radius: "50%",
          data: [
            { value: 1048, name: "Search Engine" },
            { value: 735, name: "Direct" },
            { value: 580, name: "Email" },
            { value: 484, name: "Union Ads" },
            { value: 300, name: "Video Ads" },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    });

    const result = await generateEChartsTool.run({
      echartsOption,
      width: TEST_CONFIG.defaultWidth,
      height: TEST_CONFIG.defaultHeight,
      theme: TEST_CONFIG.defaultTheme,
    });

    const buffer = extractImageBuffer(result);
    await expect(buffer).toImageEqual(
      TEST_CONFIG.outputDir,
      "echarts-pie-custom",
      {
        maxError: TEST_CONFIG.defaultMaxError,
      },
    );
  });

  it("should return SVG when outputType is svg", async () => {
    const echartsOption = JSON.stringify({
      title: { text: "SVG Test" },
      xAxis: { data: ["A", "B", "C"] },
      yAxis: {},
      series: [{ type: "bar", data: [1, 2, 3] }],
    });

    const result = await generateEChartsTool.run({
      echartsOption,
      outputType: "svg",
      width: 400,
      height: 300,
    });

    // SVG output should be wrapped in content array like PNG
    expect(typeof result).toBe("object");
    expect(result.content).toBeDefined();
    expect(Array.isArray(result.content)).toBe(true);
    expect(result.content[0].type).toBe("text");
    expect(result.content[0].text).toContain("<svg");
    expect(result.content[0].text).toContain("</svg>");
  });
});
