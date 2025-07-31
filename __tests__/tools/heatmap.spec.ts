import { describe, expect, it } from "vitest";
import { generateHeatmapChartTool } from "../../src/tools/heatmap";
import "../utils/matcher";

describe("Heatmap Chart Tool", () => {
  it("should generate a basic heatmap chart", async () => {
    const result = await generateHeatmapChartTool.run({
      title: "Sales Performance Matrix",
      data: [
        { category: "Product A", time: "Q1", value: 120 },
        { category: "Product A", time: "Q2", value: 150 },
        { category: "Product A", time: "Q3", value: 180 },
        { category: "Product B", time: "Q1", value: 100 },
        { category: "Product B", time: "Q2", value: 130 },
        { category: "Product B", time: "Q3", value: 160 },
        { category: "Product C", time: "Q1", value: 80 },
        { category: "Product C", time: "Q2", value: 110 },
        { category: "Product C", time: "Q3", value: 140 },
      ],
      width: 800,
      height: 600,
      theme: "default",
    });

    await expect(result).toImageEqual("heatmap-basic");
  });

  it("should generate numerical coordinate heatmap", async () => {
    const result = await generateHeatmapChartTool.run({
      title: "Correlation Matrix",
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
      width: 800,
      height: 600,
      theme: "default",
    });

    await expect(result).toImageEqual("heatmap-numerical");
  });
});
