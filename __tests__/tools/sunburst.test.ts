import { describe, expect, it } from "vitest";
import { generateSunburstChartTool } from "../../src/tools/sunburst";
import { TEST_CONFIG, extractImageBuffer } from "../utils/matcher";

describe("Sunburst Chart Tool", () => {
  it("should generate a basic sunburst chart", async () => {
    const result = await generateSunburstChartTool.run({
      title: "Technology Stack Distribution",
      data: [
        {
          name: "Frontend",
          value: 100,
          children: [
            {
              name: "React",
              value: 60,
              children: [
                { name: "Components", value: 30 },
                { name: "Hooks", value: 30 },
              ],
            },
            { name: "Vue", value: 40 },
          ],
        },
        {
          name: "Backend",
          value: 80,
          children: [
            { name: "Node.js", value: 50 },
            { name: "Python", value: 30 },
          ],
        },
      ],
      width: TEST_CONFIG.defaultWidth,
      height: TEST_CONFIG.defaultHeight,
      theme: TEST_CONFIG.defaultTheme,
    });

    const buffer = extractImageBuffer(result);
    await expect(buffer).toImageEqual(TEST_CONFIG.outputDir, "sunburst-basic", {
      maxError: TEST_CONFIG.defaultMaxError,
    });
  });
});
