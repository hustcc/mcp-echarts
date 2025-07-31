import { describe, expect, it } from "vitest";
import { generateTreeChartTool } from "../../src/tools/tree";
import { TEST_CONFIG, extractImageBuffer } from "../utils/matcher";

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
      width: TEST_CONFIG.defaultWidth,
      height: TEST_CONFIG.defaultHeight,
      theme: TEST_CONFIG.defaultTheme,
    });

    const buffer = extractImageBuffer(result);
    await expect(buffer).toImageEqual(TEST_CONFIG.outputDir, "tree-basic", {
      maxError: TEST_CONFIG.defaultMaxError,
    });
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
      width: TEST_CONFIG.defaultWidth,
      height: TEST_CONFIG.defaultHeight,
      theme: TEST_CONFIG.defaultTheme,
    });

    const buffer = extractImageBuffer(result);
    await expect(buffer).toImageEqual(TEST_CONFIG.outputDir, "tree-radial", {
      maxError: TEST_CONFIG.defaultMaxError,
    });
  });
});
