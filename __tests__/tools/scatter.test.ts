import { describe, expect, it } from "vitest";
import { generateScatterChartTool } from "../../src/tools/scatter";
import { TEST_CONFIG, extractImageBuffer } from "../utils/matcher";

describe("Scatter Chart Tool", () => {
  it("should generate a basic scatter chart", async () => {
    const result = await generateScatterChartTool.run({
      title: "Height vs Weight Correlation",
      axisXTitle: "Height (cm)",
      axisYTitle: "Weight (kg)",
      data: [
        { x: 160, y: 50 },
        { x: 165, y: 55 },
        { x: 170, y: 60 },
        { x: 175, y: 65 },
        { x: 180, y: 70 },
        { x: 185, y: 75 },
        { x: 190, y: 80 },
      ],
      width: TEST_CONFIG.defaultWidth,
      height: TEST_CONFIG.defaultHeight,
      theme: TEST_CONFIG.defaultTheme,
    });

    const buffer = extractImageBuffer(result);
    await expect(buffer).toImageEqual(TEST_CONFIG.outputDir, "scatter-basic", {
      maxError: TEST_CONFIG.defaultMaxError,
    });
  });

  it("should generate scatter chart with more data points", async () => {
    // Generate random scattered data
    const data = [];
    for (let i = 0; i < 50; i++) {
      data.push({
        x: Math.random() * 100,
        y: Math.random() * 100 + Math.random() * 20 - 10,
      });
    }

    const result = await generateScatterChartTool.run({
      title: "Random Data Distribution",
      axisXTitle: "X Values",
      axisYTitle: "Y Values",
      data,
      width: TEST_CONFIG.defaultWidth,
      height: TEST_CONFIG.defaultHeight,
      theme: TEST_CONFIG.defaultTheme,
    });

    const buffer = extractImageBuffer(result);
    await expect(buffer).toImageEqual(TEST_CONFIG.outputDir, "scatter-random", {
      maxError: 0.1, // Higher tolerance for random data
    });
  });
});
