import { describe, expect, it } from "vitest";
import { generatePieChartTool } from "../../src/tools/pie";
import { TEST_CONFIG, extractImageBuffer } from "../utils/matcher";

describe("Pie Chart Tool", () => {
  it("should generate a basic pie chart", async () => {
    const result = await generatePieChartTool.run({
      title: "Market Share Distribution",
      data: [
        { category: "Search Engine", value: 1048 },
        { category: "Direct Visit", value: 735 },
        { category: "Email Marketing", value: 580 },
        { category: "Affiliate Ads", value: 484 },
        { category: "Video Ads", value: 300 },
      ],
      width: TEST_CONFIG.defaultWidth,
      height: TEST_CONFIG.defaultHeight,
      theme: TEST_CONFIG.defaultTheme,
    });

    const buffer = extractImageBuffer(result);
    await expect(buffer).toImageEqual(TEST_CONFIG.outputDir, "pie-basic", {
      maxError: TEST_CONFIG.defaultMaxError,
    });
  });

  it("should generate a donut chart", async () => {
    const result = await generatePieChartTool.run({
      title: "Budget Allocation (Donut Chart)",
      data: [
        { category: "Development", value: 45 },
        { category: "Marketing", value: 30 },
        { category: "Operations", value: 15 },
        { category: "Support", value: 10 },
      ],
      width: TEST_CONFIG.defaultWidth,
      height: TEST_CONFIG.defaultHeight,
      theme: TEST_CONFIG.defaultTheme,
      innerRadius: 0.4,
    });

    const buffer = extractImageBuffer(result);
    await expect(buffer).toImageEqual(TEST_CONFIG.outputDir, "pie-donut", {
      maxError: TEST_CONFIG.defaultMaxError,
    });
  });

  it("should generate a pie chart with many categories", async () => {
    const result = await generatePieChartTool.run({
      title: "Sales by Product Category",
      data: [
        { category: "Electronics", value: 320 },
        { category: "Clothing", value: 280 },
        { category: "Books", value: 150 },
        { category: "Sports", value: 120 },
        { category: "Home", value: 90 },
        { category: "Beauty", value: 75 },
        { category: "Toys", value: 50 },
        { category: "Others", value: 35 },
      ],
      width: TEST_CONFIG.defaultWidth,
      height: TEST_CONFIG.defaultHeight,
      theme: TEST_CONFIG.defaultTheme,
    });

    const buffer = extractImageBuffer(result);
    await expect(buffer).toImageEqual(
      TEST_CONFIG.outputDir,
      "pie-many-categories",
      {
        maxError: TEST_CONFIG.defaultMaxError,
      },
    );
  });
});
