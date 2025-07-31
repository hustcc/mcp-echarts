import { describe, expect, it } from "vitest";
import { generateGaugeChartTool } from "../../src/tools/gauge";
import "../utils/matcher";

describe("Gauge Chart Tool", () => {
  it("should generate a basic gauge chart", async () => {
    const result = await generateGaugeChartTool.run({
      title: "CPU Usage Monitor",
      data: [{ name: "CPU Usage", value: 75 }],
      width: 800,
      height: 600,
      theme: "default",
    });

    await expect(result).toImageEqual("gauge-basic");
  });

  it("should generate gauge chart with custom min/max values", async () => {
    const result = await generateGaugeChartTool.run({
      title: "Temperature Reading",
      data: [{ name: "Temperature", value: 25 }],
      min: -10,
      max: 50,
      width: 800,
      height: 600,
      theme: "default",
    });

    await expect(result).toImageEqual("gauge-custom-range");
  });

  it("should generate multiple gauge charts", async () => {
    const result = await generateGaugeChartTool.run({
      title: "System Monitoring",
      data: [
        { name: "CPU", value: 75 },
        { name: "Memory", value: 60 },
        { name: "Disk", value: 45 },
      ],
      width: 800,
      height: 600,
      theme: "default",
    });

    await expect(result).toImageEqual("gauge-multiple");
  });
});
