import { describe, expect, it } from "vitest";
import { generateAreaChartTool } from "../../src/tools/area";
import "../utils/matcher";

describe("Area Chart Tool", () => {
  it("should generate a basic area chart", async () => {
    const result = await generateAreaChartTool.run({
      data: [
        { time: "2015", value: 23 },
        { time: "2016", value: 32 },
        { time: "2017", value: 28 },
        { time: "2018", value: 45 },
        { time: "2019", value: 38 },
        { time: "2020", value: 52 },
      ],
      title: "Basic Area Chart",
      width: 600,
      height: 400,
    });

    await expect(result).toImageEqual("area-basic");
  });

  it("should generate a stacked area chart", async () => {
    const result = await generateAreaChartTool.run({
      data: [
        { group: "Series A", time: "2015", value: 23 },
        { group: "Series A", time: "2016", value: 32 },
        { group: "Series A", time: "2017", value: 28 },
        { group: "Series B", time: "2015", value: 18 },
        { group: "Series B", time: "2016", value: 25 },
        { group: "Series B", time: "2017", value: 22 },
      ],
      title: "Stacked Area Chart",
      stack: true,
      width: 600,
      height: 400,
    });

    await expect(result).toImageEqual("area-stacked");
  });

  it("should generate an area chart with custom styling", async () => {
    const result = await generateAreaChartTool.run({
      data: [
        { time: "Q1", value: 100 },
        { time: "Q2", value: 150 },
        { time: "Q3", value: 120 },
        { time: "Q4", value: 180 },
      ],
      title: "Custom Styled Area Chart",
      width: 800,
      height: 500,
      theme: "dark",
      style: {
        backgroundColor: "#1a1a1a",
        palette: ["#ff6b6b", "#4ecdc4", "#45b7d1"],
      },
    });

    await expect(result).toImageEqual("area-custom");
  });

  it("should generate area chart with smooth curves", async () => {
    const result = await generateAreaChartTool.run({
      data: [
        { time: "Jan", value: 10 },
        { time: "Feb", value: 25 },
        { time: "Mar", value: 15 },
        { time: "Apr", value: 35 },
        { time: "May", value: 20 },
        { time: "Jun", value: 40 },
      ],
      title: "Smooth Area Chart",
      smooth: true,
      width: 600,
      height: 400,
    });

    await expect(result).toImageEqual("area-smooth");
  });
});
