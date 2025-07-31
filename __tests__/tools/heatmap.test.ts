import { describe, expect, it } from "vitest";
import { generateHeatmapChartTool } from "../../src/tools/heatmap";
import { TEST_CONFIG, extractImageBuffer } from "../utils/matcher";

describe("Heatmap Chart Tool", () => {
  it("should generate a basic heatmap chart", async () => {
    const result = await generateHeatmapChartTool.run({
      title: "Website Activity Heatmap",
      axisXTitle: "Day of Week",
      axisYTitle: "Hour of Day",
      data: [
        { x: "Mon", y: "9AM", value: 5 },
        { x: "Mon", y: "10AM", value: 8 },
        { x: "Mon", y: "11AM", value: 12 },
        { x: "Tue", y: "9AM", value: 7 },
        { x: "Tue", y: "10AM", value: 15 },
        { x: "Tue", y: "11AM", value: 10 },
        { x: "Wed", y: "9AM", value: 3 },
        { x: "Wed", y: "10AM", value: 9 },
        { x: "Wed", y: "11AM", value: 18 },
      ],
      width: TEST_CONFIG.defaultWidth,
      height: TEST_CONFIG.defaultHeight,
      theme: TEST_CONFIG.defaultTheme,
    });

    const buffer = extractImageBuffer(result);
    await expect(buffer).toImageEqual(TEST_CONFIG.outputDir, "heatmap-basic", {
      maxError: TEST_CONFIG.defaultMaxError,
    });
  });

  it("should generate numerical coordinate heatmap", async () => {
    const result = await generateHeatmapChartTool.run({
      title: "Data Correlation Matrix",
      axisXTitle: "Variable X",
      axisYTitle: "Variable Y",
      data: [
        { x: 0, y: 0, value: 1.0 },
        { x: 0, y: 1, value: 0.8 },
        { x: 0, y: 2, value: 0.3 },
        { x: 1, y: 0, value: 0.8 },
        { x: 1, y: 1, value: 1.0 },
        { x: 1, y: 2, value: 0.5 },
        { x: 2, y: 0, value: 0.3 },
        { x: 2, y: 1, value: 0.5 },
        { x: 2, y: 2, value: 1.0 },
      ],
      width: TEST_CONFIG.defaultWidth,
      height: TEST_CONFIG.defaultHeight,
      theme: TEST_CONFIG.defaultTheme,
    });

    const buffer = extractImageBuffer(result);
    await expect(buffer).toImageEqual(
      TEST_CONFIG.outputDir,
      "heatmap-numerical",
      {
        maxError: TEST_CONFIG.defaultMaxError,
      },
    );
  });
});
