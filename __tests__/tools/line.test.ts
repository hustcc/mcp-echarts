import { describe, expect, it } from "vitest";
import { generateLineChartTool } from "../../src/tools/line";
import { TEST_CONFIG, extractImageBuffer } from "../utils/matcher";

describe("Line Chart Tool", () => {
  it("should generate a basic line chart", async () => {
    const result = await generateLineChartTool.run({
      title: "Temperature Trend",
      axisXTitle: "Month",
      axisYTitle: "Temperature (°C)",
      data: [
        { time: "January", value: 12 },
        { time: "February", value: 15 },
        { time: "March", value: 18 },
        { time: "April", value: 22 },
        { time: "May", value: 26 },
        { time: "June", value: 30 },
      ],
      width: TEST_CONFIG.defaultWidth,
      height: TEST_CONFIG.defaultHeight,
      theme: TEST_CONFIG.defaultTheme,
    });

    const buffer = extractImageBuffer(result);
    await expect(buffer).toImageEqual(TEST_CONFIG.outputDir, "line-basic", {
      maxError: TEST_CONFIG.defaultMaxError,
    });
  });

  it("should generate a smooth line chart with area", async () => {
    const result = await generateLineChartTool.run({
      title: "Sales Trend (Smooth with Area)",
      axisXTitle: "Quarter",
      axisYTitle: "Sales (K)",
      data: [
        { time: "Q1", value: 150 },
        { time: "Q2", value: 230 },
        { time: "Q3", value: 324 },
        { time: "Q4", value: 218 },
      ],
      width: TEST_CONFIG.defaultWidth,
      height: TEST_CONFIG.defaultHeight,
      theme: TEST_CONFIG.defaultTheme,
      smooth: true,
      showArea: true,
      showSymbol: true,
    });

    const buffer = extractImageBuffer(result);
    await expect(buffer).toImageEqual(
      TEST_CONFIG.outputDir,
      "line-smooth-area",
      {
        maxError: TEST_CONFIG.defaultMaxError,
      },
    );
  });

  it("should generate a multi-series line chart", async () => {
    const result = await generateLineChartTool.run({
      title: "Product Sales Comparison",
      axisXTitle: "Month",
      axisYTitle: "Sales",
      data: [
        { time: "Jan", value: 120, group: "Product A" },
        { time: "Jan", value: 100, group: "Product B" },
        { time: "Feb", value: 200, group: "Product A" },
        { time: "Feb", value: 150, group: "Product B" },
        { time: "Mar", value: 150, group: "Product A" },
        { time: "Mar", value: 180, group: "Product B" },
        { time: "Apr", value: 80, group: "Product A" },
        { time: "Apr", value: 90, group: "Product B" },
      ],
      width: TEST_CONFIG.defaultWidth,
      height: TEST_CONFIG.defaultHeight,
      theme: TEST_CONFIG.defaultTheme,
      showSymbol: true,
    });

    const buffer = extractImageBuffer(result);
    await expect(buffer).toImageEqual(
      TEST_CONFIG.outputDir,
      "line-multi-series",
      {
        maxError: TEST_CONFIG.defaultMaxError,
      },
    );
  });

  it("should generate a stacked line chart", async () => {
    const result = await generateLineChartTool.run({
      title: "Revenue Stack",
      axisXTitle: "Year",
      axisYTitle: "Revenue (M)",
      data: [
        { time: "2020", value: 120, group: "Online" },
        { time: "2020", value: 100, group: "Offline" },
        { time: "2021", value: 200, group: "Online" },
        { time: "2021", value: 150, group: "Offline" },
        { time: "2022", value: 250, group: "Online" },
        { time: "2022", value: 180, group: "Offline" },
      ],
      width: TEST_CONFIG.defaultWidth,
      height: TEST_CONFIG.defaultHeight,
      theme: TEST_CONFIG.defaultTheme,
      stack: true,
      showArea: true,
    });

    const buffer = extractImageBuffer(result);
    await expect(buffer).toImageEqual(TEST_CONFIG.outputDir, "line-stacked", {
      maxError: TEST_CONFIG.defaultMaxError,
    });
  });
});
