import { describe, expect, it } from "vitest";
import { generateCandlestickChartTool } from "../../src/tools/candlestick";
import { TEST_CONFIG, extractImageBuffer } from "../utils/matcher";

describe("Candlestick Chart Tool", () => {
  it("should generate a basic candlestick chart", async () => {
    const result = await generateCandlestickChartTool.run({
      title: "Stock Price Analysis",
      data: [
        { date: "2023-01-01", open: 100, high: 110, low: 95, close: 105 },
        { date: "2023-01-02", open: 105, high: 120, low: 100, close: 115 },
        { date: "2023-01-03", open: 115, high: 125, low: 110, close: 112 },
        { date: "2023-01-04", open: 112, high: 118, low: 108, close: 116 },
        { date: "2023-01-05", open: 116, high: 130, low: 115, close: 125 },
      ],
      width: TEST_CONFIG.defaultWidth,
      height: TEST_CONFIG.defaultHeight,
      theme: TEST_CONFIG.defaultTheme,
    });

    const buffer = extractImageBuffer(result);
    await expect(buffer).toImageEqual(
      TEST_CONFIG.outputDir,
      "candlestick-basic",
      {
        maxError: TEST_CONFIG.defaultMaxError,
      },
    );
  });

  it("should generate candlestick chart with volume", async () => {
    const result = await generateCandlestickChartTool.run({
      title: "Stock Price with Volume",
      data: [
        {
          date: "2023-01-01",
          open: 100,
          high: 110,
          low: 95,
          close: 105,
          volume: 10000,
        },
        {
          date: "2023-01-02",
          open: 105,
          high: 120,
          low: 100,
          close: 115,
          volume: 15000,
        },
        {
          date: "2023-01-03",
          open: 115,
          high: 125,
          low: 110,
          close: 112,
          volume: 12000,
        },
      ],
      showVolume: true,
      width: TEST_CONFIG.defaultWidth,
      height: TEST_CONFIG.defaultHeight,
      theme: TEST_CONFIG.defaultTheme,
    });

    const buffer = extractImageBuffer(result);
    await expect(buffer).toImageEqual(
      TEST_CONFIG.outputDir,
      "candlestick-volume",
      {
        maxError: TEST_CONFIG.defaultMaxError,
      },
    );
  });
});
