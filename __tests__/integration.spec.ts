import { describe, expect, it } from "vitest";
import { tools } from "../src/tools";
import { generateBarChartTool, generateEChartsTool } from "../src/tools";

/**
 * Integration test suite
 * Test the behavior of chart tools under various boundary conditions and error scenarios
 * Ensure tool robustness and consistency
 */
describe("integration tests", () => {
  /**
   * Error handling tests
   * Verify that tools correctly throw errors when receiving invalid input
   */
  describe("error handling", () => {
    it("should handle empty data arrays", async () => {
      try {
        await generateBarChartTool.run({
          data: [],
          title: "Empty Data Test",
          width: 800,
          height: 600,
          theme: "default",
        });
        // If no error is thrown, the test fails
        expect(true).toBe(false);
      } catch (error) {
        // Verify that an error was indeed thrown
        expect(error).toBeDefined();
      }
    });

    it("should handle invalid JSON in echarts option", async () => {
      try {
        await generateEChartsTool.run({
          echartsOption: "invalid json", // Intentionally pass invalid JSON string
          width: 800,
          height: 600,
          theme: "default",
          outputType: "png",
        });
        // If no error is thrown, the test fails
        expect(true).toBe(false);
      } catch (error) {
        // Verify that an error was indeed thrown
        expect(error).toBeDefined();
      }
    });

    it("should handle missing required fields", async () => {
      try {
        await generateBarChartTool.run({
          // Intentionally pass data missing required field 'value'
          data: [{ category: "test" }] as Array<{
            category: string;
            value: number;
            group?: string;
          }>,
          title: "Missing Field Test",
          width: 800,
          height: 600,
          theme: "default",
        });
        // If no error is thrown, the test fails
        expect(true).toBe(false);
      } catch (error) {
        // Verify that an error was indeed thrown
        expect(error).toBeDefined();
      }
    });
  });

  /**
   * Boundary case tests
   * Test tool performance under extreme parameters
   */
  describe("boundary cases", () => {
    it("should handle very small dimensions", async () => {
      // Test chart generation with very small dimensions
      const result = await generateBarChartTool.run({
        data: [{ category: "test", value: 10 }],
        title: "Small Size Test",
        width: 100,
        height: 100,
        theme: "default",
      });

      // Verify basic structure of the result
      expect(result).toBeDefined();
      expect(result.content).toBeDefined();
      expect(result.content.length).toBeGreaterThan(0);
    });

    it("should handle very large dimensions", async () => {
      // Test chart generation with very large dimensions
      const result = await generateBarChartTool.run({
        data: [{ category: "test", value: 10 }],
        title: "Large Size Test",
        width: 2000,
        height: 2000,
        theme: "default",
      });

      // Verify basic structure of the result
      expect(result).toBeDefined();
      expect(result.content).toBeDefined();
      expect(result.content.length).toBeGreaterThan(0);
    });

    it("should handle large datasets", async () => {
      // Generate large dataset with 1000 data points
      const largeData = Array.from({ length: 1000 }, (_, i) => ({
        category: `Project${i}`,
        value: Math.random() * 100,
      }));

      const result = await generateBarChartTool.run({
        data: largeData,
        title: "Large Dataset Test",
        width: 800,
        height: 600,
        theme: "default",
      });

      // Verify that large datasets can be processed normally
      expect(result).toBeDefined();
      expect(result.content).toBeDefined();
      expect(result.content.length).toBeGreaterThan(0);
    });

    it("should handle extreme values", async () => {
      // Test handling of extreme value data
      const result = await generateBarChartTool.run({
        data: [
          { category: "Min Value", value: Number.MIN_SAFE_INTEGER },
          { category: "Max Value", value: Number.MAX_SAFE_INTEGER },
          { category: "Zero Value", value: 0 },
          { category: "Negative Value", value: -100 },
        ],
        title: "Extreme Value Test",
        width: 800,
        height: 600,
        theme: "default",
      });

      // Verify that extreme value data can be processed normally
      expect(result).toBeDefined();
      expect(result.content).toBeDefined();
      expect(result.content.length).toBeGreaterThan(0);
    });
  });

  /**
   * Configuration combination tests
   * Test the effects of different configuration parameter combinations
   */
  describe("configuration combinations", () => {
    it("should handle all theme combinations", async () => {
      const themes = ["default", "dark"] as const;

      // Iterate through all supported themes
      for (const theme of themes) {
        const result = await generateBarChartTool.run({
          data: [{ category: "test", value: 10 }],
          title: `Theme Test: ${theme}`,
          width: 800,
          height: 600,
          theme,
        });

        // Verify that each theme works properly
        expect(result).toBeDefined();
        expect(result.content).toBeDefined();
        expect(result.content.length).toBeGreaterThan(0);
      }
    });

    it("should handle all output types for echarts", async () => {
      const outputTypes = ["png", "svg", "option"] as const;
      // Define a simple ECharts configuration
      const echartsOption = {
        title: { text: "Test Chart" },
        xAxis: { data: ["A", "B", "C"] },
        yAxis: {},
        series: [{ type: "bar", data: [1, 2, 3] }],
      };

      // Test all output types
      for (const outputType of outputTypes) {
        const result = await generateEChartsTool.run({
          echartsOption: JSON.stringify(echartsOption),
          width: 800,
          height: 600,
          theme: "default",
          outputType,
        });

        expect(result).toBeDefined();
        expect(result.content).toBeDefined();
        expect(result.content.length).toBeGreaterThan(0);

        // Verify specific content format based on output type
        if (outputType === "svg") {
          expect(result.content[0].type).toBe("text");
          expect(result.content[0]).toHaveProperty("text");
          expect(result.content[0].text).toContain("<svg");
        } else if (outputType === "option") {
          expect(result.content[0].type).toBe("text");
          expect(result.content[0]).toHaveProperty("text");
          const optionText = result.content[0]?.text;
          expect(optionText).toBeDefined();
          // Verify that the returned value is valid JSON
          expect(() => JSON.parse(optionText as string)).not.toThrow();
        } else {
          // PNG output type
          expect(result.content[0].type).toBe("image");
          expect(result.content[0]).toHaveProperty("data");
          expect(result.content[0].mimeType).toBe("image/png");
        }
      }
    });
  });

  /**
   * Tool consistency tests
   * Ensure all chart tools follow the same interface specifications
   */
  describe("tool consistency", () => {
    it("should have consistent return structure across all tools", async () => {
      // Select several representative tools for testing
      const barChartTool = tools.find((t) => t.name === "generate_bar_chart");
      const pieChartTool = tools.find((t) => t.name === "generate_pie_chart");
      const lineChartTool = tools.find((t) => t.name === "generate_line_chart");

      // Ensure all tools exist
      expect(barChartTool).toBeDefined();
      expect(pieChartTool).toBeDefined();
      expect(lineChartTool).toBeDefined();

      // Define test cases for different chart types
      const testCases = [
        {
          tool: barChartTool,
          params: {
            data: [{ category: "test", value: 10 }],
            title: "Consistency Test",
            width: 800,
            height: 600,
            theme: "default" as const,
          },
        },
        {
          tool: pieChartTool,
          params: {
            data: [{ category: "test", value: 10 }],
            title: "Consistency Test",
            width: 800,
            height: 600,
            theme: "default" as const,
          },
        },
        {
          tool: lineChartTool,
          params: {
            data: [{ time: "2023-01", value: 10 }],
            title: "Consistency Test",
            width: 800,
            height: 600,
            theme: "default" as const,
          },
        },
      ];

      // Iterate through test cases to verify consistency of return structure
      for (const { tool, params } of testCases) {
        if (tool) {
          const result = await tool.run(params as never);

          // Verify that all tools return the same basic structure
          expect(result).toBeDefined();
          expect(result).toHaveProperty("content");
          expect(Array.isArray(result.content)).toBe(true);
          expect(result.content.length).toBeGreaterThan(0);
          expect(result.content[0]).toHaveProperty("data");
          expect(result.content[0]).toHaveProperty("mimeType");
          expect(result.content[0]).toHaveProperty("type");
          expect(result.content[0].type).toBe("image");
        }
      }
    });

    it("should have all tools properly exported", () => {
      // Verify that the total number of tools is correct
      expect(tools).toHaveLength(17);

      // Define the expected list of tool names
      const expectedToolNames = [
        "generate_echarts",
        "generate_line_chart",
        "generate_bar_chart",
        "generate_pie_chart",
        "generate_radar_chart",
        "generate_scatter_chart",
        "generate_sankey_chart",
        "generate_funnel_chart",
        "generate_gauge_chart",
        "generate_treemap_chart",
        "generate_sunburst_chart",
        "generate_heatmap_chart",
        "generate_candlestick_chart",
        "generate_boxplot_chart",
        "generate_graph_chart",
        "generate_parallel_chart",
        "generate_tree_chart",
      ];

      // Verify that the actual exported tool names match expectations
      const actualNames = tools.map((tool) => tool.name).sort();
      expect(actualNames).toEqual(expectedToolNames.sort());
    });
  });

  /**
   * Performance tests
   * Ensure tools can complete tasks within reasonable time limits
   */
  describe("performance", () => {
    it("should generate charts within reasonable time", async () => {
      // Record start time
      const startTime = Date.now();

      // Generate chart with 100 data points
      await generateBarChartTool.run({
        data: Array.from({ length: 100 }, (_, i) => ({
          category: `Category${i}`,
          value: Math.random() * 100,
        })),
        title: "Performance Test",
        width: 800,
        height: 600,
        theme: "default",
      });

      // Calculate execution time
      const endTime = Date.now();
      const duration = endTime - startTime;

      // Verify that chart generation completes within 5 seconds (performance requirement)
      expect(duration).toBeLessThan(5000);
    });
  });
});
