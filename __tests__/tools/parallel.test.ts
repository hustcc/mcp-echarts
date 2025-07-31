import { describe, expect, it } from "vitest";
import { generateParallelChartTool } from "../../src/tools/parallel";
import { TEST_CONFIG, extractImageBuffer } from "../utils/matcher";

describe("Parallel Chart Tool", () => {
  it("should generate a basic parallel coordinates chart", async () => {
    const result = await generateParallelChartTool.run({
      title: "Product Comparison",
      dimensions: ["Price", "Quality", "Service", "Value"],
      data: [
        { name: "Product A", values: [4.2, 3.4, 2.3, 1.8] },
        { name: "Product B", values: [2.4, 4.2, 3.8, 3.1] },
        { name: "Product C", values: [1.8, 2.8, 4.1, 4.3] },
        { name: "Product D", values: [3.6, 3.8, 2.9, 2.4] },
      ],
      width: TEST_CONFIG.defaultWidth,
      height: TEST_CONFIG.defaultHeight,
      theme: TEST_CONFIG.defaultTheme,
    });

    const buffer = extractImageBuffer(result);
    await expect(buffer).toImageEqual(TEST_CONFIG.outputDir, "parallel-basic", {
      maxError: TEST_CONFIG.defaultMaxError,
    });
  });

  it("should generate car performance parallel chart", async () => {
    const result = await generateParallelChartTool.run({
      title: "Car Performance Analysis",
      dimensions: ["Speed", "Safety", "Comfort", "Efficiency"],
      data: [
        { name: "Sports Car", values: [9.5, 7.0, 6.0, 4.0] },
        { name: "SUV", values: [6.0, 9.0, 8.5, 5.5] },
        { name: "Electric", values: [7.5, 8.0, 7.0, 9.5] },
        { name: "Compact", values: [5.5, 6.5, 6.0, 8.5] },
      ],
      width: TEST_CONFIG.defaultWidth,
      height: TEST_CONFIG.defaultHeight,
      theme: TEST_CONFIG.defaultTheme,
    });

    const buffer = extractImageBuffer(result);
    await expect(buffer).toImageEqual(TEST_CONFIG.outputDir, "parallel-cars", {
      maxError: TEST_CONFIG.defaultMaxError,
    });
  });
});
