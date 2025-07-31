import { describe, expect, it } from "vitest";
import { generateGraphChartTool } from "../../src/tools/graph";
import "../utils/matcher";

describe("Graph Chart Tool", () => {
  it("should generate a basic graph chart", async () => {
    const result = await generateGraphChartTool.run({
      title: "Social Network",
      data: {
        nodes: [
          { id: "1", name: "Alice" },
          { id: "2", name: "Bob" },
          { id: "3", name: "Charlie" },
          { id: "4", name: "David" },
        ],
        edges: [
          { source: "1", target: "2" },
          { source: "2", target: "3" },
          { source: "3", target: "4" },
          { source: "4", target: "1" },
        ],
      },
      width: 800,
      height: 600,
      theme: "default",
    });

    await expect(result).toImageEqual("graph-basic");
  });
});
