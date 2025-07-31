import { describe, expect, it } from "vitest";
import {
  generateBarChartTool,
  generateBoxplotChartTool,
  generateCandlestickChartTool,
  generateEChartsTool,
  generateFunnelChartTool,
  generateGaugeChartTool,
  generateGraphChartTool,
  generateHeatmapChartTool,
  generateLineChartTool,
  generateParallelChartTool,
  generatePieChartTool,
  generateRadarChartTool,
  generateSankeyChartTool,
  generateScatterChartTool,
  generateSunburstChartTool,
  generateTreeChartTool,
  generateTreemapChartTool,
} from "../../src/tools";
import { zodToJsonSchema } from "../schema";

// Import expected JSON Schema definition files
import barExpected from "../schema/bar.json";
import boxplotExpected from "../schema/boxplot.json";
import candlestickExpected from "../schema/candlestick.json";
import echartsExpected from "../schema/echarts.json";
import funnelExpected from "../schema/funnel.json";
import gaugeExpected from "../schema/gauge.json";
import graphExpected from "../schema/graph.json";
import heatmapExpected from "../schema/heatmap.json";
import lineExpected from "../schema/line.json";
import parallelExpected from "../schema/parallel.json";
import pieExpected from "../schema/pie.json";
import radarExpected from "../schema/radar.json";
import sankeyExpected from "../schema/sankey.json";
import scatterExpected from "../schema/scatter.json";
import sunburstExpected from "../schema/sunburst.json";
import treeExpected from "../schema/tree.json";
import treemapExpected from "../schema/treemap.json";

/**
 * Chart tools JSON Schema validation test suite
 * Validates that each chart tool's input schema definition matches the expected JSON Schema
 * Ensures tool interface stability and backward compatibility
 */
describe("charts schema check", () => {
  /**
   * Chart tool test configuration array
   * Contains names, tool instances, and expected schemas for all 17 chart tools
   */
  const chartTests = [
    { name: "echarts", tool: generateEChartsTool, expected: echartsExpected }, // Generic ECharts tool
    { name: "line", tool: generateLineChartTool, expected: lineExpected }, // Line chart tool
    { name: "bar", tool: generateBarChartTool, expected: barExpected }, // Bar chart tool
    { name: "pie", tool: generatePieChartTool, expected: pieExpected }, // Pie chart tool
    { name: "radar", tool: generateRadarChartTool, expected: radarExpected }, // Radar chart tool
    {
      name: "scatter",
      tool: generateScatterChartTool,
      expected: scatterExpected, // Scatter chart tool
    },
    { name: "sankey", tool: generateSankeyChartTool, expected: sankeyExpected }, // Sankey chart tool
    { name: "funnel", tool: generateFunnelChartTool, expected: funnelExpected }, // Funnel chart tool
    { name: "gauge", tool: generateGaugeChartTool, expected: gaugeExpected }, // Gauge chart tool
    {
      name: "treemap",
      tool: generateTreemapChartTool,
      expected: treemapExpected, // Treemap chart tool
    },
    {
      name: "sunburst",
      tool: generateSunburstChartTool,
      expected: sunburstExpected, // Sunburst chart tool
    },
    {
      name: "heatmap",
      tool: generateHeatmapChartTool,
      expected: heatmapExpected, // Heatmap chart tool
    },
    {
      name: "candlestick",
      tool: generateCandlestickChartTool,
      expected: candlestickExpected, // Candlestick chart tool
    },
    {
      name: "boxplot",
      tool: generateBoxplotChartTool,
      expected: boxplotExpected, // Boxplot chart tool
    },
    { name: "graph", tool: generateGraphChartTool, expected: graphExpected }, // Graph chart tool
    {
      name: "parallel",
      tool: generateParallelChartTool,
      expected: parallelExpected, // Parallel coordinates chart tool
    },
    { name: "tree", tool: generateTreeChartTool, expected: treeExpected }, // Tree chart tool
  ];

  /**
   * Create independent Schema validation tests for each chart tool
   * Validates that the tool's actual Schema matches the expected Schema exactly
   */
  for (const { name, tool, expected } of chartTests) {
    it(`should check schema for ${name} chart`, () => {
      // Extract all properties except the run function from the tool
      const { run, inputSchema, ...rest } = tool;

      // Build the actual Schema object, converting Zod Schema to JSON Schema
      const actualSchema = {
        ...rest,
        inputSchema: zodToJsonSchema(inputSchema),
      };

      // Validate that the actual Schema matches the expected Schema exactly
      expect(actualSchema).toEqual(expected);
    });
  }

  /**
   * Tool name uniqueness validation
   * Ensures all chart tool names are unique to avoid naming conflicts
   */
  it("should have unique tool names", () => {
    // Extract all tool names
    const names = chartTests.map((test) => test.expected.name);
    const uniqueNames = new Set(names);

    // Validate that the number of unique names matches the original count
    expect(uniqueNames.size).toBe(names.length);
  });

  /**
   * Tool basic properties completeness validation
   * Validates that each tool contains required properties and correct Schema structure
   */
  it("should have required properties for all tools", () => {
    for (const { name, expected } of chartTests) {
      // Validate that tools contain basic properties
      expect(expected).toHaveProperty("name");
      expect(expected).toHaveProperty("description");
      expect(expected).toHaveProperty("inputSchema");

      // Validate basic structure of inputSchema
      expect(expected.inputSchema).toHaveProperty("type", "object");
      expect(expected.inputSchema).toHaveProperty("properties");
    }
  });
});
