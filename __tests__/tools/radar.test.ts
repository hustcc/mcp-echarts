import { describe, expect, it } from "vitest";
import { generateRadarChartTool } from "../../src/tools/radar";
import { TEST_CONFIG, extractImageBuffer } from "../utils/matcher";

describe("Radar Chart Tool", () => {
  it("should generate a basic radar chart", async () => {
    const result = await generateRadarChartTool.run({
      title: "Performance Evaluation",
      data: [
        { name: "Design", value: 80 },
        { name: "Development", value: 90 },
        { name: "Marketing", value: 70 },
        { name: "Support", value: 85 },
        { name: "Sales", value: 75 },
      ],
      width: TEST_CONFIG.defaultWidth,
      height: TEST_CONFIG.defaultHeight,
      theme: TEST_CONFIG.defaultTheme,
    });

    const buffer = extractImageBuffer(result);
    await expect(buffer).toImageEqual(TEST_CONFIG.outputDir, "radar-basic", {
      maxError: TEST_CONFIG.defaultMaxError,
    });
  });

  it("should generate a radar chart comparing multiple entities", async () => {
    const result = await generateRadarChartTool.run({
      title: "Product Feature Comparison",
      data: [
        { name: "Weight", value: 70, group: "Product A" },
        { name: "Weight", value: 75, group: "Product B" },
        { name: "Battery", value: 80, group: "Product A" },
        { name: "Battery", value: 70, group: "Product B" },
        { name: "Performance", value: 85, group: "Product A" },
        { name: "Performance", value: 80, group: "Product B" },
        { name: "Price", value: 60, group: "Product A" },
        { name: "Price", value: 85, group: "Product B" },
      ],
      width: TEST_CONFIG.defaultWidth,
      height: TEST_CONFIG.defaultHeight,
      theme: TEST_CONFIG.defaultTheme,
    });

    const buffer = extractImageBuffer(result);
    await expect(buffer).toImageEqual(
      TEST_CONFIG.outputDir,
      "radar-comparison",
      {
        maxError: TEST_CONFIG.defaultMaxError,
      },
    );
  });
});
