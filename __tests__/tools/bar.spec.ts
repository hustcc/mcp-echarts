import { describe, expect, it } from "vitest";
import { generateBarChartTool } from "../../src/tools/bar";
import "../utils/matcher";

describe("Bar Chart Tool", () => {
  it("should generate a basic bar chart", async () => {
    const result = await generateBarChartTool.run({
      title: "Basic Bar Chart Example",
      axisXTitle: "Categories",
      axisYTitle: "Values",
      data: [
        { category: "Shirt", value: 120 },
        { category: "Sweater", value: 200 },
        { category: "Chiffon Top", value: 150 },
        { category: "Pants", value: 80 },
        { category: "High Heels", value: 70 },
        { category: "Socks", value: 110 },
      ],
      width: 800,
      height: 600,
      theme: "default",
    });

    await expect(result).toImageEqual("bar-basic");
  });

  it("should generate a grouped bar chart", async () => {
    const result = await generateBarChartTool.run({
      title: "Grouped Bar Chart Example",
      axisXTitle: "Categories",
      axisYTitle: "Values",
      data: [
        { category: "Q1", value: 120, group: "Sales" },
        { category: "Q1", value: 100, group: "Marketing" },
        { category: "Q2", value: 200, group: "Sales" },
        { category: "Q2", value: 150, group: "Marketing" },
        { category: "Q3", value: 150, group: "Sales" },
        { category: "Q3", value: 180, group: "Marketing" },
        { category: "Q4", value: 80, group: "Sales" },
        { category: "Q4", value: 90, group: "Marketing" },
      ],
      width: 800,
      height: 600,
      theme: "default",
      group: true,
    });

    await expect(result).toImageEqual("bar-grouped");
  });

  it("should generate a stacked bar chart", async () => {
    const result = await generateBarChartTool.run({
      title: "Stacked Bar Chart Example",
      axisXTitle: "Quarters",
      axisYTitle: "Revenue",
      data: [
        { category: "Q1", value: 120, group: "Product A" },
        { category: "Q1", value: 100, group: "Product B" },
        { category: "Q2", value: 200, group: "Product A" },
        { category: "Q2", value: 150, group: "Product B" },
        { category: "Q3", value: 150, group: "Product A" },
        { category: "Q3", value: 180, group: "Product B" },
        { category: "Q4", value: 80, group: "Product A" },
        { category: "Q4", value: 90, group: "Product B" },
      ],
      width: 800,
      height: 600,
      theme: "default",
      stack: true,
    });

    await expect(result).toImageEqual("bar-stacked");
  });
});
