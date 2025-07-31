import { describe, expect, it } from "vitest";
import { generateSankeyChartTool } from "../../src/tools/sankey";
import "../utils/matcher";

describe("Sankey Chart Tool", () => {
  it("should generate a basic sankey chart", async () => {
    const result = await generateSankeyChartTool.run({
      title: "Basic Sankey Flow",
      data: [
        { source: "A", target: "X", value: 5 },
        { source: "A", target: "Y", value: 7 },
        { source: "A", target: "Z", value: 6 },
        { source: "B", target: "X", value: 2 },
        { source: "B", target: "Y", value: 9 },
        { source: "B", target: "Z", value: 4 },
      ],
      width: 800,
      height: 600,
      theme: "default",
    });

    await expect(result).toImageEqual("sankey-basic");
  });

  it("should generate energy flow sankey chart", async () => {
    const result = await generateSankeyChartTool.run({
      title: "Energy Flow Analysis",
      data: [
        { source: "Coal", target: "Power Plant", value: 60 },
        { source: "Gas", target: "Power Plant", value: 40 },
        { source: "Power Plant", target: "Residential", value: 50 },
        { source: "Power Plant", target: "Industrial", value: 30 },
        { source: "Power Plant", target: "Commercial", value: 20 },
      ],
      nodeAlign: "left",
      width: 800,
      height: 600,
      theme: "default",
    });

    await expect(result).toImageEqual("sankey-energy-flow");
  });
});
