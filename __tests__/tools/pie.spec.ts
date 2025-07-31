import { describe, expect, it } from "vitest";
import { generatePieChartTool } from "../../src/tools/pie";
import "../utils/matcher";

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
      width: 800,
      height: 600,
      theme: "default",
    });

    await expect(result).toImageEqual("pie-basic");
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
      width: 800,
      height: 600,
      theme: "default",
      innerRadius: 0.4,
    });

    await expect(result).toImageEqual("pie-donut");
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
      width: 800,
      height: 600,
      theme: "default",
    });

    await expect(result).toImageEqual("pie-many-categories");
  });
});
