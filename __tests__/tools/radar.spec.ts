import { describe, expect, it } from "vitest";
import { generateRadarChartTool } from "../../src/tools/radar";
import "../utils/matcher";

describe("Radar Chart Tool", () => {
  it("should generate a basic radar chart", async () => {
    const result = await generateRadarChartTool.run({
      title: "Product Evaluation",
      data: [
        { name: "Quality", value: 80 },
        { name: "Price", value: 70 },
        { name: "Service", value: 60 },
        { name: "Design", value: 90 },
        { name: "Performance", value: 85 },
      ],
      width: 800,
      height: 600,
      theme: "default",
    });

    await expect(result).toImageEqual("radar-basic");
  });

  it("should generate a radar chart comparing multiple entities", async () => {
    const result = await generateRadarChartTool.run({
      title: "Product Comparison",
      data: [
        { name: "Quality", value: 80, group: "Product A" },
        { name: "Quality", value: 70, group: "Product B" },
        { name: "Price", value: 70, group: "Product A" },
        { name: "Price", value: 85, group: "Product B" },
        { name: "Service", value: 60, group: "Product A" },
        { name: "Service", value: 90, group: "Product B" },
        { name: "Design", value: 90, group: "Product A" },
        { name: "Design", value: 75, group: "Product B" },
      ],
      width: 800,
      height: 600,
      theme: "default",
    });

    await expect(result).toImageEqual("radar-comparison");
  });
});
