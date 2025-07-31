import { describe, expect, it } from "vitest";
import { generateFunnelChartTool } from "../../src/tools/funnel";
import { TEST_CONFIG, extractImageBuffer } from "../utils/matcher";

describe("Funnel Chart Tool", () => {
  it("should generate a basic funnel chart", async () => {
    const result = await generateFunnelChartTool.run({
      title: "Sales Conversion Funnel",
      data: [
        { category: "Website Visits", value: 50000 },
        { category: "Product Views", value: 35000 },
        { category: "Add to Cart", value: 25000 },
        { category: "Checkout", value: 15000 },
        { category: "Purchase", value: 8000 },
      ],
      width: TEST_CONFIG.defaultWidth,
      height: TEST_CONFIG.defaultHeight,
      theme: TEST_CONFIG.defaultTheme,
    });

    const buffer = extractImageBuffer(result);
    await expect(buffer).toImageEqual(TEST_CONFIG.outputDir, "funnel-basic", {
      maxError: TEST_CONFIG.defaultMaxError,
    });
  });

  it("should generate marketing funnel chart", async () => {
    const result = await generateFunnelChartTool.run({
      title: "Marketing Campaign Funnel",
      data: [
        { category: "Impressions", value: 100000 },
        { category: "Clicks", value: 5000 },
        { category: "Landing Page", value: 4500 },
        { category: "Sign Up", value: 1200 },
        { category: "Purchase", value: 300 },
      ],
      width: TEST_CONFIG.defaultWidth,
      height: TEST_CONFIG.defaultHeight,
      theme: TEST_CONFIG.defaultTheme,
    });

    const buffer = extractImageBuffer(result);
    await expect(buffer).toImageEqual(
      TEST_CONFIG.outputDir,
      "funnel-marketing",
      {
        maxError: TEST_CONFIG.defaultMaxError,
      },
    );
  });
});
