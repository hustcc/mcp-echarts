import { describe, expect, it } from "vitest";
import { generateSankeyChartTool } from "../../src/tools/sankey";
import { TEST_CONFIG, extractImageBuffer } from "../utils/matcher";

describe("Sankey Chart Tool", () => {
  it("should generate a basic sankey chart", async () => {
    const result = await generateSankeyChartTool.run({
      title: "User Flow Analysis",
      data: [
        { source: "Landing Page", target: "Product Page", value: 50000 },
        { source: "Product Page", target: "Add to Cart", value: 35000 },
        { source: "Add to Cart", target: "Checkout", value: 25000 },
        { source: "Checkout", target: "Purchase", value: 15000 },
        { source: "Product Page", target: "Exit", value: 15000 },
        { source: "Add to Cart", target: "Exit", value: 10000 },
      ],
      width: TEST_CONFIG.defaultWidth,
      height: TEST_CONFIG.defaultHeight,
      theme: TEST_CONFIG.defaultTheme,
    });

    const buffer = extractImageBuffer(result);
    await expect(buffer).toImageEqual(TEST_CONFIG.outputDir, "sankey-basic", {
      maxError: TEST_CONFIG.defaultMaxError,
    });
  });

  it("should generate energy flow sankey chart", async () => {
    const result = await generateSankeyChartTool.run({
      title: "Energy Flow Diagram",
      data: [
        { source: "Coal", target: "Power Plant", value: 40 },
        { source: "Natural Gas", target: "Power Plant", value: 30 },
        { source: "Solar", target: "Power Plant", value: 20 },
        { source: "Wind", target: "Power Plant", value: 10 },
        { source: "Power Plant", target: "Residential", value: 50 },
        { source: "Power Plant", target: "Industrial", value: 30 },
        { source: "Power Plant", target: "Commercial", value: 20 },
      ],
      nodeAlign: "left",
      width: TEST_CONFIG.defaultWidth,
      height: TEST_CONFIG.defaultHeight,
      theme: TEST_CONFIG.defaultTheme,
    });

    const buffer = extractImageBuffer(result);
    await expect(buffer).toImageEqual(
      TEST_CONFIG.outputDir,
      "sankey-energy-flow",
      {
        maxError: TEST_CONFIG.defaultMaxError,
      },
    );
  });
});
