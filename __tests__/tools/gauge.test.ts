import { describe, expect, it } from "vitest";
import { generateGaugeChartTool } from "../../src/tools/gauge";
import { TEST_CONFIG, extractImageBuffer } from "../utils/matcher";

describe("Gauge Chart Tool", () => {
  it("should generate a basic gauge chart", async () => {
    const result = await generateGaugeChartTool.run({
      title: "CPU Usage Monitor",
      data: [{ name: "CPU Usage", value: 75 }],
      width: TEST_CONFIG.defaultWidth,
      height: TEST_CONFIG.defaultHeight,
      theme: TEST_CONFIG.defaultTheme,
    });

    const buffer = extractImageBuffer(result);
    await expect(buffer).toImageEqual(TEST_CONFIG.outputDir, "gauge-basic", {
      maxError: TEST_CONFIG.defaultMaxError,
    });
  });

  it("should generate gauge chart with custom min/max values", async () => {
    const result = await generateGaugeChartTool.run({
      title: "Temperature Reading",
      data: [{ name: "Temperature", value: 25 }],
      min: -10,
      max: 50,
      width: TEST_CONFIG.defaultWidth,
      height: TEST_CONFIG.defaultHeight,
      theme: TEST_CONFIG.defaultTheme,
    });

    const buffer = extractImageBuffer(result);
    await expect(buffer).toImageEqual(
      TEST_CONFIG.outputDir,
      "gauge-custom-range",
      {
        maxError: TEST_CONFIG.defaultMaxError,
      },
    );
  });

  it("should generate multiple gauge charts", async () => {
    const result = await generateGaugeChartTool.run({
      title: "System Monitoring",
      data: [
        { name: "CPU", value: 75 },
        { name: "Memory", value: 60 },
        { name: "Disk", value: 45 },
      ],
      width: TEST_CONFIG.defaultWidth,
      height: TEST_CONFIG.defaultHeight,
      theme: TEST_CONFIG.defaultTheme,
    });

    const buffer = extractImageBuffer(result);
    await expect(buffer).toImageEqual(TEST_CONFIG.outputDir, "gauge-multiple", {
      maxError: TEST_CONFIG.defaultMaxError,
    });
  });
});
