import { describe, expect, it } from "vitest";
import { generateScatterChartTool } from "../../src/tools/scatter";
import "../utils/matcher";

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
      width: 800,
      height: 600,
      theme: "default",
    });

    await expect(result).toImageEqual("scatter-basic");
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
      width: 800,
      height: 600,
      theme: "default",
    });

    await expect(result).toImageEqual("scatter-random");
  });
});
