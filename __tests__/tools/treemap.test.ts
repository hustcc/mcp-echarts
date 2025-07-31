import { describe, expect, it } from "vitest";
import { generateTreemapChartTool } from "../../src/tools/treemap";
import { TEST_CONFIG, extractImageBuffer } from "../utils/matcher";

describe("Treemap Chart Tool", () => {
  it("should generate a basic treemap chart", async () => {
    const result = await generateTreemapChartTool.run({
      title: "Disk Usage Analysis",
      data: [
        {
          name: "Documents",
          value: 500,
          children: [
            { name: "Photos", value: 200 },
            { name: "Videos", value: 150 },
            { name: "Office Files", value: 150 },
          ],
        },
        {
          name: "Applications",
          value: 300,
          children: [
            { name: "Development", value: 180 },
            { name: "Media", value: 120 },
          ],
        },
        {
          name: "System",
          value: 200,
          children: [
            { name: "OS Files", value: 120 },
            { name: "Cache", value: 80 },
          ],
        },
      ],
      width: TEST_CONFIG.defaultWidth,
      height: TEST_CONFIG.defaultHeight,
      theme: TEST_CONFIG.defaultTheme,
    });

    const buffer = extractImageBuffer(result);
    await expect(buffer).toImageEqual(TEST_CONFIG.outputDir, "treemap-basic", {
      maxError: TEST_CONFIG.defaultMaxError,
    });
  });
});
