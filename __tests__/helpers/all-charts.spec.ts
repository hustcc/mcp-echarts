import path from "node:path";
import type { EChartsOption } from "echarts";
import { describe, expect, it } from "vitest";
import { renderECharts } from "../../src/utils/render";
import { toImageEqual } from "./toImageEqual";
import type { toImageEqualOptions } from "./toImageEqual";

// Extend expect type
declare module "vitest" {
  interface Assertion<T = unknown> {
    toImageEqual(
      dir: string,
      name: string,
      options?: toImageEqualOptions,
    ): Promise<void>;
  }
}

// Add custom matcher
expect.extend({
  async toImageEqual(
    received: Buffer,
    dir: string,
    name: string,
    options: toImageEqualOptions = {},
  ) {
    const result = await toImageEqual(received, dir, name, options);
    return {
      pass: result.pass,
      message: result.message,
    };
  },
});

describe("All ECharts Types - Image Generation Tests", () => {
  const testOutputDir = path.join(__dirname, "../snapshots");

  it("should generate bar chart", async () => {
    const option: EChartsOption = {
      title: { text: "Bar Chart Example" },
      tooltip: {},
      legend: { data: ["Sales"] },
      xAxis: {
        type: "category" as const,
        data: [
          "Shirt",
          "Sweater",
          "Chiffon Top",
          "Pants",
          "High Heels",
          "Socks",
        ],
      },
      yAxis: { type: "value" as const },
      series: [
        {
          name: "Sales",
          type: "bar" as const,
          data: [120, 200, 150, 80, 70, 110],
        },
      ],
    };
    const buffer = (await renderECharts(
      option,
      800,
      600,
      "default",
      "png",
    )) as Buffer;
    await expect(buffer).toImageEqual(testOutputDir, "bar");
  });

  it("should generate line chart", async () => {
    const option: EChartsOption = {
      title: { text: "Line Chart Example" },
      tooltip: {},
      legend: { data: ["Temperature"] },
      xAxis: {
        type: "category",
        data: ["January", "February", "March", "April", "May", "June"],
      },
      yAxis: { type: "value" },
      series: [
        { name: "Temperature", type: "line", data: [12, 15, 18, 22, 26, 30] },
      ],
    };
    const buffer = (await renderECharts(
      option,
      800,
      600,
      "default",
      "png",
    )) as Buffer;
    await expect(buffer).toImageEqual(testOutputDir, "line");
  });

  it("should generate pie chart", async () => {
    const option: EChartsOption = {
      title: { text: "Pie Chart Example", left: "center" },
      tooltip: { trigger: "item" },
      series: [
        {
          name: "Source of Visit",
          type: "pie",
          radius: "50%",
          data: [
            { value: 1048, name: "Search Engine" },
            { value: 735, name: "Direct Visit" },
            { value: 580, name: "Email Marketing" },
            { value: 484, name: "Affiliate Ads" },
            { value: 300, name: "Video Ads" },
          ],
        },
      ],
    };
    const buffer = (await renderECharts(
      option,
      800,
      600,
      "default",
      "png",
    )) as Buffer;
    await expect(buffer).toImageEqual(testOutputDir, "pie");
  });

  it("should generate scatter chart", async () => {
    const option: EChartsOption = {
      title: { text: "Scatter Plot Example" },
      tooltip: {},
      xAxis: { type: "value" },
      yAxis: { type: "value" },
      series: [
        {
          type: "scatter",
          data: [
            [10, 8],
            [23, 20],
            [15, 12],
            [30, 25],
            [18, 16],
            [25, 22],
          ],
        },
      ],
    };
    const buffer = (await renderECharts(
      option,
      800,
      600,
      "default",
      "png",
    )) as Buffer;
    await expect(buffer).toImageEqual(testOutputDir, "scatter", {
      maxError: 0.1,
    });
  });

  it("should generate radar chart", async () => {
    const option: EChartsOption = {
      title: { text: "Radar Chart Example" },
      radar: {
        indicator: [
          { name: "Sales", max: 6500 },
          { name: "Management", max: 16000 },
          { name: "IT", max: 30000 },
          { name: "Customer Service", max: 38000 },
          { name: "R&D", max: 52000 },
          { name: "Marketing", max: 25000 },
        ],
      },
      series: [
        {
          type: "radar",
          data: [
            {
              value: [4200, 3000, 20000, 35000, 50000, 18000],
              name: "Budget Allocation",
            },
          ],
        },
      ],
    };
    const buffer = (await renderECharts(
      option,
      800,
      600,
      "default",
      "png",
    )) as Buffer;
    await expect(buffer).toImageEqual(testOutputDir, "radar", {
      maxError: 0.1,
    });
  });

  it("should generate gauge chart", async () => {
    const option: EChartsOption = {
      title: { text: "Gauge Chart Example" },
      series: [
        {
          type: "gauge",
          data: [{ value: 75, name: "Completion Rate" }],
          min: 0,
          max: 100,
          splitNumber: 10,
        },
      ],
    };
    const buffer = (await renderECharts(
      option,
      800,
      600,
      "default",
      "png",
    )) as Buffer;
    await expect(buffer).toImageEqual(testOutputDir, "gauge", {
      maxError: 0.1,
    });
  });

  it("should generate funnel chart", async () => {
    const option: EChartsOption = {
      title: { text: "Funnel Chart Example" },
      tooltip: { trigger: "item" },
      series: [
        {
          type: "funnel",
          left: "10%",
          top: 60,
          width: "80%",
          height: "80%",
          data: [
            { value: 60, name: "Visit" },
            { value: 40, name: "Consult" },
            { value: 20, name: "Order" },
            { value: 80, name: "Click" },
            { value: 100, name: "Display" },
          ],
        },
      ],
    };
    const buffer = (await renderECharts(
      option,
      800,
      600,
      "default",
      "png",
    )) as Buffer;
    await expect(buffer).toImageEqual(testOutputDir, "funnel", {
      maxError: 0.1,
    });
  });

  it("should generate heatmap chart", async () => {
    const option: EChartsOption = {
      title: { text: "Heatmap Example" },
      tooltip: {},
      xAxis: { type: "category", data: ["A", "B", "C", "D", "E"] },
      yAxis: { type: "category", data: ["1", "2", "3", "4", "5"] },
      visualMap: {
        min: 0,
        max: 150,
        calculable: true,
        orient: "horizontal",
        left: "center",
        bottom: "15%",
      },
      series: [
        {
          type: "heatmap",
          data: [
            [0, 0, 10],
            [0, 1, 19],
            [0, 2, 8],
            [0, 3, 24],
            [0, 4, 67],
            [1, 0, 92],
            [1, 1, 58],
            [1, 2, 78],
            [1, 3, 117],
            [1, 4, 48],
            [2, 0, 35],
            [2, 1, 15],
            [2, 2, 123],
            [2, 3, 64],
            [2, 4, 52],
            [3, 0, 72],
            [3, 1, 132],
            [3, 2, 114],
            [3, 3, 19],
            [3, 4, 16],
            [4, 0, 38],
            [4, 1, 5],
            [4, 2, 8],
            [4, 3, 117],
            [4, 4, 115],
          ],
        },
      ],
    };
    const buffer = (await renderECharts(
      option,
      800,
      600,
      "default",
      "png",
    )) as Buffer;
    await expect(buffer).toImageEqual(testOutputDir, "heatmap", {
      maxError: 0.1,
    });
  });

  it("should generate sunburst chart", async () => {
    const option: EChartsOption = {
      title: { text: "Sunburst Chart Example" },
      series: [
        {
          type: "sunburst",
          data: [
            {
              name: "Root Node",
              children: [
                {
                  name: "Branch A",
                  value: 10,
                  children: [
                    { name: "Leaf A1", value: 5 },
                    { name: "Leaf A2", value: 5 },
                  ],
                },
                {
                  name: "Branch B",
                  value: 20,
                  children: [
                    { name: "Leaf B1", value: 8 },
                    { name: "Leaf B2", value: 12 },
                  ],
                },
              ],
            },
          ],
          radius: [0, "95%"],
        },
      ],
    };
    const buffer = (await renderECharts(
      option,
      800,
      600,
      "default",
      "png",
    )) as Buffer;
    await expect(buffer).toImageEqual(testOutputDir, "sunburst", {
      maxError: 0.1,
    });
  });

  it("should generate treemap chart", async () => {
    const option: EChartsOption = {
      title: { text: "Treemap Example" },
      series: [
        {
          type: "treemap",
          data: [
            {
              name: "Root Node",
              children: [
                { name: "Node 1", value: 10 },
                { name: "Node 2", value: 20 },
                { name: "Node 3", value: 30 },
                { name: "Node 4", value: 15 },
              ],
            },
          ],
        },
      ],
    };
    const buffer = (await renderECharts(
      option,
      800,
      600,
      "default",
      "png",
    )) as Buffer;
    await expect(buffer).toImageEqual(testOutputDir, "treemap", {
      maxError: 0.1,
    });
  });

  it("should generate tree chart", async () => {
    const option: EChartsOption = {
      title: { text: "Tree Chart Example" },
      series: [
        {
          type: "tree",
          data: [
            {
              name: "Root Node",
              children: [
                {
                  name: "Branch 1",
                  children: [{ name: "Leaf 1-1" }, { name: "Leaf 1-2" }],
                },
                {
                  name: "Branch 2",
                  children: [{ name: "Leaf 2-1" }, { name: "Leaf 2-2" }],
                },
              ],
            },
          ],
          top: "1%",
          left: "7%",
          bottom: "1%",
          right: "20%",
          symbolSize: 7,
          label: { position: "left", verticalAlign: "middle", align: "right" },
        },
      ],
    };
    const buffer = (await renderECharts(
      option,
      800,
      600,
      "default",
      "png",
    )) as Buffer;
    await expect(buffer).toImageEqual(testOutputDir, "tree");
  });

  it("should generate graph chart", async () => {
    const option: EChartsOption = {
      title: { text: "Relation Graph Example" },
      series: [
        {
          type: "graph",
          layout: "force",
          data: [
            { name: "Node 1", x: 300, y: 300 },
            { name: "Node 2", x: 800, y: 300 },
            { name: "Node 3", x: 550, y: 100 },
            { name: "Node 4", x: 550, y: 500 },
          ],
          links: [
            { source: 0, target: 1 },
            { source: 0, target: 2 },
            { source: 0, target: 3 },
            { source: 1, target: 2 },
          ],
          force: { repulsion: 4000 },
        },
      ],
    };
    const buffer = (await renderECharts(
      option,
      800,
      600,
      "default",
      "png",
    )) as Buffer;
    await expect(buffer).toImageEqual(testOutputDir, "graph", {
      maxError: 0.1,
    });
  });

  it("should generate sankey chart", async () => {
    const option: EChartsOption = {
      title: { text: "Sankey Diagram Example" },
      series: [
        {
          type: "sankey",
          data: [
            { name: "a" },
            { name: "b" },
            { name: "a1" },
            { name: "a2" },
            { name: "b1" },
            { name: "c" },
          ],
          links: [
            { source: "a", target: "a1", value: 5 },
            { source: "a", target: "a2", value: 3 },
            { source: "b", target: "b1", value: 8 },
            { source: "a", target: "b1", value: 3 },
            { source: "b1", target: "a1", value: 1 },
            { source: "b1", target: "c", value: 2 },
          ],
        },
      ],
    };
    const buffer = (await renderECharts(
      option,
      800,
      600,
      "default",
      "png",
    )) as Buffer;
    await expect(buffer).toImageEqual(testOutputDir, "sankey", {
      maxError: 0.1,
    });
  });

  it("should generate boxplot chart", async () => {
    const option: EChartsOption = {
      title: { text: "Boxplot Example" },
      xAxis: { type: "category", data: ["A", "B", "C", "D", "E"] },
      yAxis: { type: "value" },
      series: [
        {
          type: "boxplot",
          data: [
            [1, 9, 21, 54, 78],
            [2, 12, 24, 65, 89],
            [3, 15, 30, 70, 95],
            [1, 8, 18, 48, 72],
            [4, 18, 35, 75, 98],
          ],
        },
      ],
    };
    const buffer = (await renderECharts(
      option,
      800,
      600,
      "default",
      "png",
    )) as Buffer;
    await expect(buffer).toImageEqual(testOutputDir, "boxplot", {
      maxError: 0.1,
    });
  });

  it("should generate candlestick chart", async () => {
    const option: EChartsOption = {
      title: { text: "Candlestick Chart Example" },
      xAxis: {
        type: "category",
        data: ["2021-01", "2021-02", "2021-03", "2021-04", "2021-05"],
      },
      yAxis: { type: "value" },
      series: [
        {
          type: "candlestick",
          data: [
            [20, 34, 10, 38],
            [40, 35, 30, 50],
            [31, 38, 33, 44],
            [38, 15, 5, 42],
            [20, 40, 15, 45],
          ],
        },
      ],
    };
    const buffer = (await renderECharts(
      option,
      800,
      600,
      "default",
      "png",
    )) as Buffer;
    await expect(buffer).toImageEqual(testOutputDir, "candlestick", {
      maxError: 0.1,
    });
  });

  it("should generate parallel chart", async () => {
    const option: EChartsOption = {
      title: { text: "Parallel Coordinates Example" },
      parallelAxis: [
        { dim: 0, name: "Price" },
        { dim: 1, name: "Net Weight" },
        { dim: 2, name: "Volume" },
        { dim: 3, name: "Displacement" },
      ],
      series: [
        {
          type: "parallel",
          data: [
            [12.99, 100, 82, 1.0],
            [9.99, 80, 78, 1.2],
            [20, 120, 90, 2.0],
            [15.5, 110, 85, 1.6],
          ],
        },
      ],
    };
    const buffer = (await renderECharts(
      option,
      800,
      600,
      "default",
      "png",
    )) as Buffer;
    await expect(buffer).toImageEqual(testOutputDir, "parallel", {
      maxError: 0.1,
    });
  });
});
