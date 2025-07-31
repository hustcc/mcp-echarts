import { describe, expect, it } from "vitest";
import { generateLineChartTool } from "../../src/tools/line";
import "../utils/matcher";

describe("Line Chart Tool", () => {
  it("should generate a basic line chart", async () => {
    const result = await generateLineChartTool.run({
      title: "Temperature Trend",
      axisXTitle: "Month",
      axisYTitle: "Temperature (°C)",
      data: [
        { time: "January", value: 12 },
        { time: "February", value: 15 },
        { time: "March", value: 18 },
        { time: "April", value: 22 },
        { time: "May", value: 26 },
        { time: "June", value: 30 },
      ],
      width: 800,
      height: 600,
      theme: "default",
    });

    await expect(result).toImageEqual("line-basic");
  });

  it("should generate a smooth line chart with area", async () => {
    const result = await generateLineChartTool.run({
      title: "Sales Trend (Smooth with Area)",
      axisXTitle: "Quarter",
      axisYTitle: "Sales (K)",
      data: [
        { time: "Q1", value: 150 },
        { time: "Q2", value: 230 },
        { time: "Q3", value: 324 },
        { time: "Q4", value: 218 },
      ],
      width: 800,
      height: 600,
      theme: "default",
      smooth: true,
      showArea: true,
      showSymbol: true,
    });

    await expect(result).toImageEqual("line-smooth-area");
  });

  it("should generate a multi-series line chart", async () => {
    const result = await generateLineChartTool.run({
      title: "Product Sales Comparison",
      axisXTitle: "Month",
      axisYTitle: "Sales",
      data: [
        { time: "Jan", value: 120, group: "Product A" },
        { time: "Jan", value: 100, group: "Product B" },
        { time: "Feb", value: 200, group: "Product A" },
        { time: "Feb", value: 150, group: "Product B" },
        { time: "Mar", value: 150, group: "Product A" },
        { time: "Mar", value: 180, group: "Product B" },
        { time: "Apr", value: 80, group: "Product A" },
        { time: "Apr", value: 90, group: "Product B" },
      ],
      width: 800,
      height: 600,
      theme: "default",
      showSymbol: true,
    });

    await expect(result).toImageEqual("line-multi-series");
  });

  it("should generate a stacked line chart", async () => {
    const result = await generateLineChartTool.run({
      title: "Revenue Stack",
      axisXTitle: "Year",
      axisYTitle: "Revenue (M)",
      data: [
        { time: "2020", value: 120, group: "Online" },
        { time: "2020", value: 100, group: "Offline" },
        { time: "2021", value: 200, group: "Online" },
        { time: "2021", value: 150, group: "Offline" },
        { time: "2022", value: 250, group: "Online" },
        { time: "2022", value: 180, group: "Offline" },
      ],
      width: 800,
      height: 600,
      theme: "default",
      stack: true,
      showArea: true,
    });

    await expect(result).toImageEqual("line-stacked");
  });
});
