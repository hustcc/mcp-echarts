import { describe, expect, it } from "vitest";
import { generateTreeChartTool } from "../../src/tools/tree";
import "../utils/matcher";

describe("Tree Chart Tool", () => {
  it("should generate a basic tree chart", async () => {
    const result = await generateTreeChartTool.run({
      title: "Organization Structure",
      data: {
        name: "CEO",
        children: [
          {
            name: "CTO",
            children: [
              { name: "Backend Team" },
              { name: "Frontend Team" },
              { name: "DevOps Team" },
            ],
          },
          {
            name: "CMO",
            children: [{ name: "Marketing Team" }, { name: "Sales Team" }],
          },
        ],
      },
      width: 800,
      height: 600,
      theme: "default",
    });

    await expect(result).toImageEqual("tree-basic");
  });

  it("should generate a radial tree chart", async () => {
    const result = await generateTreeChartTool.run({
      title: "Family Tree (Radial)",
      data: {
        name: "Grandparents",
        children: [
          {
            name: "Parent A",
            children: [{ name: "Child A1" }, { name: "Child A2" }],
          },
          {
            name: "Parent B",
            children: [
              { name: "Child B1" },
              { name: "Child B2" },
              { name: "Child B3" },
            ],
          },
        ],
      },
      layout: "radial",
      width: 800,
      height: 600,
      theme: "default",
    });

    await expect(result).toImageEqual("tree-radial");
  });
});
