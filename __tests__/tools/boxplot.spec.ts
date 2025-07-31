import { describe, expect, it } from "vitest";
import { generateBoxplotChartTool } from "../../src/tools/boxplot";
import "../utils/matcher";

describe("Boxplot Chart Tool", () => {
  it("should generate a basic boxplot chart", async () => {
    const result = await generateBoxplotChartTool.run({
      title: "Test Score Distribution",
      axisXTitle: "Subject",
      axisYTitle: "Score",
      data: [
        { category: "Math", value: 85 },
        { category: "Math", value: 90 },
        { category: "Math", value: 78 },
        { category: "Math", value: 92 },
        { category: "Math", value: 88 },
        { category: "English", value: 75 },
        { category: "English", value: 80 },
        { category: "English", value: 85 },
        { category: "English", value: 70 },
        { category: "English", value: 82 },
        { category: "Science", value: 88 },
        { category: "Science", value: 92 },
        { category: "Science", value: 85 },
        { category: "Science", value: 90 },
        { category: "Science", value: 87 },
      ],
      width: 800,
      height: 600,
      theme: "default",
    });

    await expect(result).toImageEqual("boxplot-basic");
  });
});
