import { describe, expect, it } from "vitest";
import { tools } from "../../src/tools";

/**
 * Tool index validation test suite
 * Validates the basic structure, quantity, and properties of all chart tools to ensure compliance
 * Ensures consistency and completeness of tool exports
 */
describe("tools index", () => {
  /**
   * Tool count validation
   * Validates that the total number of exported tools meets expectations (17 chart tools)
   */
  it("should export all 17 chart tools", () => {
    // Validate that the tools array contains 17 chart tools
    expect(tools).toHaveLength(17);
  });

  /**
   * Tool structure consistency validation
   * Validates that each tool has the required basic properties and correct types
   */
  it("should have consistent tool structure", () => {
    for (const tool of tools) {
      // Validate that tools contain all required properties
      expect(tool).toHaveProperty("name");
      expect(tool).toHaveProperty("description");
      expect(tool).toHaveProperty("inputSchema");
      expect(tool).toHaveProperty("run");

      // Validate property type correctness
      expect(typeof tool.name).toBe("string");
      expect(typeof tool.description).toBe("string");
      expect(typeof tool.run).toBe("function");

      // Validate that tool names follow naming conventions (starting with generate_)
      expect(tool.name).toMatch(/^generate_\w+$/);
    }
  });

  /**
   * Tool name uniqueness validation
   * Ensures all tool names are unique to avoid duplicate definitions
   */
  it("should have unique tool names", () => {
    const names = tools.map((tool) => tool.name);
    const uniqueNames = new Set(names);

    // Validate that the number of unique names matches the original count
    expect(uniqueNames.size).toBe(names.length);
  });

  /**
   * Expected tool list completeness validation
   * Validates that all expected chart tools are correctly exported, ensuring no omissions
   */
  it("should include all expected chart types", () => {
    // Define all expected chart tool names
    const expectedTools = [
      "generate_echarts", // Generic ECharts tool
      "generate_line_chart", // Line chart
      "generate_bar_chart", // Bar chart
      "generate_pie_chart", // Pie chart
      "generate_radar_chart", // Radar chart
      "generate_scatter_chart", // Scatter chart
      "generate_sankey_chart", // Sankey chart
      "generate_funnel_chart", // Funnel chart
      "generate_gauge_chart", // Gauge chart
      "generate_treemap_chart", // Treemap chart
      "generate_sunburst_chart", // Sunburst chart
      "generate_heatmap_chart", // Heatmap chart
      "generate_candlestick_chart", // Candlestick chart
      "generate_boxplot_chart", // Boxplot chart
      "generate_graph_chart", // Graph chart
      "generate_parallel_chart", // Parallel coordinates chart
      "generate_tree_chart", // Tree chart
    ];

    // Get actual tool names and sort them
    const actualNames = tools.map((tool) => tool.name).sort();

    // Validate that actual tool names match expected ones exactly
    expect(actualNames).toEqual(expectedTools.sort());
  });
});
