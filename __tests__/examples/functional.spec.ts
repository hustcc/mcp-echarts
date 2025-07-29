import { describe, expect, it } from "vitest";
import { tools } from "../../src/tools";

/**
 * Chart result interface definition
 * Defines the standard structure of chart tool return results
 */
interface ChartResult {
  content: Array<{
    data?: string;
    text?: string;
    mimeType?: string;
    type: string;
  }>;
}

/**
 * Validate the validity of chart results
 * @param result - The result returned by the chart tool
 */
function expectValidChartResult(result: ChartResult) {
  // Verify that the result object exists
  expect(result).toBeDefined();
  // Verify that the content array exists and is not empty
  expect(result.content).toBeDefined();
  expect(Array.isArray(result.content)).toBe(true);
  expect(result.content.length).toBeGreaterThan(0);

  // Verify basic properties of the first content item
  expect(result.content[0]).toBeDefined();
  expect(result.content[0].type).toBeDefined();

  // For image types, verify data and MIME type
  if (result.content[0].type === "image") {
    expect(result.content[0]?.data).toBeDefined();
    expect(result.content[0]?.data?.length).toBeGreaterThan(0);
    expect(result.content[0].mimeType).toBe("image/png");
  }
}

/**
 * Functional test suite
 * Tests whether the basic functionality of all chart tools works properly
 * Ensures that each tool can generate valid chart output
 */
describe("functional tests", () => {
  /**
   * Common test parameters
   * Standard test configuration for all chart types
   */
  const commonParams = {
    title: "Functional Test Chart",
    width: 800,
    height: 600,
    theme: "default" as const,
  };

  /**
   * Bar chart functionality test
   * Verifies that the bar chart tool can correctly process categorical data and generate charts
   */
  it("should generate bar chart", async () => {
    const barChartTool = tools.find((t) => t.name === "generate_bar_chart");
    expect(barChartTool).toBeDefined();

    if (barChartTool) {
      const result = await barChartTool.run({
        data: [
          { category: "Product A", value: 100 },
          { category: "Product B", value: 200 },
          { category: "Product C", value: 150 },
        ],
        ...commonParams,
      } as never);

      expectValidChartResult(result);
    }
  });

  /**
   * Line chart functionality test
   * Verifies that the line chart tool can correctly process time series data and generate trend charts
   */
  it("should generate line chart", async () => {
    const lineChartTool = tools.find((t) => t.name === "generate_line_chart");
    expect(lineChartTool).toBeDefined();

    if (lineChartTool) {
      const result = await lineChartTool.run({
        data: [
          { time: "2023-01", value: 100 },
          { time: "2023-02", value: 120 },
          { time: "2023-03", value: 110 },
        ],
        ...commonParams,
      } as never);

      expectValidChartResult(result);
    }
  });

  /**
   * Pie chart functionality test
   * Verifies that the pie chart tool can correctly process categorical data and generate circular charts
   */
  it("should generate pie chart", async () => {
    const pieChartTool = tools.find((t) => t.name === "generate_pie_chart");
    expect(pieChartTool).toBeDefined();

    if (pieChartTool) {
      const result = await pieChartTool.run({
        data: [
          { category: "Category A", value: 30 },
          { category: "Category B", value: 40 },
          { category: "Category C", value: 30 },
        ],
        ...commonParams,
      } as never);

      expectValidChartResult(result);
    }
  });

  /**
   * Radar chart functionality test
   * Verifies that the radar chart tool can correctly process multi-dimensional data and generate radar charts
   */
  it("should generate radar chart", async () => {
    const radarChartTool = tools.find((t) => t.name === "generate_radar_chart");
    expect(radarChartTool).toBeDefined();

    if (radarChartTool) {
      const result = await radarChartTool.run({
        data: [
          { name: "Product A", values: [80, 90, 70, 85, 75] },
          { name: "Product B", values: [70, 80, 85, 75, 80] },
        ],
        indicators: [
          { name: "Quality", max: 100 },
          { name: "Price", max: 100 },
          { name: "Service", max: 100 },
          { name: "Features", max: 100 },
          { name: "Experience", max: 100 },
        ],
        ...commonParams,
      } as never);

      expectValidChartResult(result);
    }
  });

  /**
   * Scatter chart functionality test
   * Verifies that the scatter chart tool can correctly process two-dimensional coordinate data and generate scatter charts
   */
  it("should generate scatter chart", async () => {
    const scatterChartTool = tools.find(
      (t) => t.name === "generate_scatter_chart",
    );
    expect(scatterChartTool).toBeDefined();

    if (scatterChartTool) {
      const result = await scatterChartTool.run({
        data: [
          { x: 10, y: 20 },
          { x: 15, y: 25 },
          { x: 20, y: 30 },
        ],
        ...commonParams,
      } as never);

      expectValidChartResult(result);
    }
  });

  /**
   * Sankey chart functionality test
   * Verifies that the sankey chart tool can correctly process flow data and generate flow charts
   */
  it("should generate sankey chart", async () => {
    const sankeyChartTool = tools.find(
      (t) => t.name === "generate_sankey_chart",
    );
    expect(sankeyChartTool).toBeDefined();

    if (sankeyChartTool) {
      const result = await sankeyChartTool.run({
        data: [
          { source: "Source A", target: "Target A", value: 10 },
          { source: "Source B", target: "Target B", value: 15 },
          { source: "Source A", target: "Target B", value: 5 },
        ],
        ...commonParams,
      } as never);

      expectValidChartResult(result);
    }
  });

  /**
   * Funnel chart functionality test
   * Verifies that the funnel chart tool can correctly process conversion data and generate funnel charts
   */
  it("should generate funnel chart", async () => {
    const funnelChartTool = tools.find(
      (t) => t.name === "generate_funnel_chart",
    );
    expect(funnelChartTool).toBeDefined();

    if (funnelChartTool) {
      const result = await funnelChartTool.run({
        data: [
          { category: "Visit", value: 1000 },
          { category: "Inquiry", value: 500 },
          { category: "Purchase", value: 100 },
        ],
        ...commonParams,
      } as never);

      expectValidChartResult(result);
    }
  });

  /**
   * Gauge chart functionality test
   * Verifies that the gauge chart tool can correctly process single values and generate gauge charts
   */
  it("should generate gauge chart", async () => {
    const gaugeChartTool = tools.find((t) => t.name === "generate_gauge_chart");
    expect(gaugeChartTool).toBeDefined();

    if (gaugeChartTool) {
      const result = await gaugeChartTool.run({
        data: [{ name: "CPU Usage", value: 75 }],
        min: 0,
        max: 100,
        ...commonParams,
      } as never);

      expectValidChartResult(result);
    }
  });

  /**
   * Treemap chart functionality test
   * Verifies that the treemap chart tool can correctly process hierarchical data and generate tree charts
   */
  it("should generate treemap chart", async () => {
    const treemapChartTool = tools.find(
      (t) => t.name === "generate_treemap_chart",
    );
    expect(treemapChartTool).toBeDefined();

    if (treemapChartTool) {
      const result = await treemapChartTool.run({
        data: [
          { name: "Category A", value: 100 },
          { name: "Category B", value: 200 },
          { name: "Category C", value: 150 },
        ],
        ...commonParams,
      } as never);

      expectValidChartResult(result);
    }
  });

  /**
   * Sunburst chart functionality test
   * Verifies that the sunburst chart tool can correctly process multi-level data and generate circular charts
   */
  it("should generate sunburst chart", async () => {
    const sunburstChartTool = tools.find(
      (t) => t.name === "generate_sunburst_chart",
    );
    expect(sunburstChartTool).toBeDefined();

    if (sunburstChartTool) {
      const result = await sunburstChartTool.run({
        data: [
          {
            name: "Root Node",
            children: [
              { name: "Child Node 1", value: 10 },
              { name: "Child Node 2", value: 20 },
            ],
          },
        ],
        ...commonParams,
      } as never);

      expectValidChartResult(result);
    }
  });

  /**
   * Heatmap chart functionality test
   * Verifies that the heatmap chart tool can correctly process matrix data and generate heatmap charts
   */
  it("should generate heatmap chart", async () => {
    const heatmapChartTool = tools.find(
      (t) => t.name === "generate_heatmap_chart",
    );
    expect(heatmapChartTool).toBeDefined();

    if (heatmapChartTool) {
      const result = await heatmapChartTool.run({
        data: [
          { x: "Monday", y: "Morning", value: 5 },
          { x: "Monday", y: "Afternoon", value: 1 },
          { x: "Tuesday", y: "Morning", value: 3 },
          { x: "Tuesday", y: "Afternoon", value: 2 },
        ],
        axisXTitle: "Day of Week",
        axisYTitle: "Time Period",
        ...commonParams,
      } as never);

      expectValidChartResult(result);
    }
  });

  /**
   * Candlestick chart functionality test
   * Verifies that the candlestick chart tool can correctly process stock data and generate candlestick charts
   */
  it("should generate candlestick chart", async () => {
    const candlestickChartTool = tools.find(
      (t) => t.name === "generate_candlestick_chart",
    );
    expect(candlestickChartTool).toBeDefined();

    if (candlestickChartTool) {
      const result = await candlestickChartTool.run({
        data: [
          ["2023-01-01", 20, 34, 10, 25],
          ["2023-01-02", 25, 40, 20, 35],
        ],
        ...commonParams,
      } as never);

      expectValidChartResult(result);
    }
  });

  /**
   * Boxplot chart functionality test
   * Verifies that the boxplot chart tool can correctly process statistical data and generate boxplot charts
   */
  it("should generate boxplot chart", async () => {
    const boxplotChartTool = tools.find(
      (t) => t.name === "generate_boxplot_chart",
    );
    expect(boxplotChartTool).toBeDefined();

    if (boxplotChartTool) {
      const result = await boxplotChartTool.run({
        data: [
          [1, 9, 13, 22, 30],
          [2, 8, 15, 25, 35],
        ],
        categories: ["Dataset 1", "Dataset 2"],
        ...commonParams,
      } as never);

      expectValidChartResult(result);
    }
  });

  /**
   * Graph chart functionality test
   * Verifies that the graph chart tool can correctly process network data and generate graph charts
   */
  it("should generate graph chart", async () => {
    const graphChartTool = tools.find((t) => t.name === "generate_graph_chart");
    expect(graphChartTool).toBeDefined();

    if (graphChartTool) {
      const result = await graphChartTool.run({
        data: {
          nodes: [
            { id: "1", name: "Node 1" },
            { id: "2", name: "Node 2" },
          ],
          edges: [{ source: "1", target: "2" }],
        },
        ...commonParams,
      } as never);

      expectValidChartResult(result);
    }
  });

  /**
   * Parallel coordinate chart functionality test
   * Verifies that the parallel coordinate chart tool can correctly process multi-dimensional data and generate parallel coordinate charts
   */
  it("should generate parallel chart", async () => {
    const parallelChartTool = tools.find(
      (t) => t.name === "generate_parallel_chart",
    );
    expect(parallelChartTool).toBeDefined();

    if (parallelChartTool) {
      const result = await parallelChartTool.run({
        data: [
          { name: "Product A", values: [4.2, 3.4, 2.3, 1.8] },
          { name: "Product B", values: [3.8, 4.1, 3.2, 2.5] },
          { name: "Product C", values: [2.9, 3.8, 4.1, 3.2] },
        ],
        dimensions: ["Price", "Quality", "Service", "Value"],
        ...commonParams,
      } as never);

      expectValidChartResult(result);
    }
  });

  /**
   * Tree chart functionality test
   * Verifies that the tree chart tool can correctly process tree data and generate tree charts
   */
  it("should generate tree chart", async () => {
    const treeChartTool = tools.find((t) => t.name === "generate_tree_chart");
    expect(treeChartTool).toBeDefined();

    if (treeChartTool) {
      const result = await treeChartTool.run({
        data: {
          name: "Root Node",
          children: [
            {
              name: "Branch 1",
              children: [{ name: "Leaf 1" }, { name: "Leaf 2" }],
            },
            { name: "Branch 2" },
          ],
        },
        ...commonParams,
      } as never);

      expectValidChartResult(result);
    }
  });

  /**
   * Custom ECharts chart functionality test
   * Verifies that the custom ECharts tool can correctly process configuration objects and generate charts
   */
  it("should generate custom echarts chart", async () => {
    const echartsChartTool = tools.find((t) => t.name === "generate_echarts");
    expect(echartsChartTool).toBeDefined();

    if (echartsChartTool) {
      // Define custom ECharts configuration
      const customOption = {
        title: { text: "Custom Chart" },
        tooltip: {},
        xAxis: {
          data: ["Shirt", "Sweater", "Chiffon", "Pants", "Heels", "Socks"],
        },
        yAxis: {},
        series: [
          {
            name: "Sales",
            type: "bar",
            data: [5, 20, 36, 10, 10, 20],
          },
        ],
      };

      const result = await echartsChartTool.run({
        echartsOption: JSON.stringify(customOption),
        width: 800,
        height: 600,
        theme: "default",
        outputType: "png",
      } as never);

      expectValidChartResult(result);
    }
  });

  /**
   * Different output types test
   * Verifies that the ECharts tool supports multiple output formats (SVG, configuration options, etc.)
   */
  it("should handle different output types", async () => {
    const echartsChartTool = tools.find((t) => t.name === "generate_echarts");
    expect(echartsChartTool).toBeDefined();

    if (echartsChartTool) {
      const customOption = {
        title: { text: "Output Type Test" },
        tooltip: {},
        xAxis: { data: ["A", "B", "C"] },
        yAxis: {},
        series: [{ name: "Data", type: "bar", data: [10, 20, 30] }],
      };

      // Test SVG output
      const svgResult = await echartsChartTool.run({
        width: 800,
        height: 600,
        theme: "default",
        outputType: "svg",
        echartsOption: JSON.stringify(customOption),
      } as never);

      expect(svgResult).toBeDefined();
      expect(svgResult.content).toBeDefined();
      expect(Array.isArray(svgResult.content)).toBe(true);
      expect(svgResult.content.length).toBeGreaterThan(0);
      expect(svgResult.content[0]).toHaveProperty("text");
      expect(svgResult.content[0]).toHaveProperty("type", "text");
      // Verify SVG content contains svg tag
      const svgContent = svgResult.content[0];
      if (svgContent && "text" in svgContent && svgContent.text) {
        expect(svgContent.text).toContain("<svg");
      }

      // Test configuration option output
      const optionResult = await echartsChartTool.run({
        width: 800,
        height: 600,
        theme: "default",
        outputType: "option",
        echartsOption: JSON.stringify(customOption),
      } as never);

      expect(optionResult).toBeDefined();
      expect(optionResult.content).toBeDefined();
      expect(Array.isArray(optionResult.content)).toBe(true);
      expect(optionResult.content.length).toBeGreaterThan(0);
      expect(optionResult.content[0]).toHaveProperty("text");
      expect(optionResult.content[0]).toHaveProperty("type", "text");
      // Verify the output text is valid JSON
      const optionContent = optionResult.content[0];
      if (optionContent && "text" in optionContent && optionContent.text) {
        expect(optionContent.text).toBeDefined();
        expect(() => JSON.parse(optionContent.text)).not.toThrow();
      }
    }
  });

  /**
   * Dark theme test
   * Verifies that chart tools support dark theme configuration
   */
  it("should handle dark theme", async () => {
    const barChartTool = tools.find((t) => t.name === "generate_bar_chart");
    expect(barChartTool).toBeDefined();

    if (barChartTool) {
      const result = await barChartTool.run({
        ...commonParams,
        theme: "dark",
        data: [
          { category: "Product A", value: 100 },
          { category: "Product B", value: 200 },
          { category: "Product C", value: 150 },
        ],
      } as never);

      expectValidChartResult(result);
    }
  });
});

// Test utility functions for validating chart result validity
