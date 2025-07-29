import path from "node:path";
import { GlobalFonts, createCanvas } from "@napi-rs/canvas";
import * as echarts from "echarts";
import type { EChartsOption } from "echarts";

const fontPath = path.join(
  __dirname,
  "..",
  "..",
  "fonts",
  "AlibabaPuHuiTi-3-55-Regular.otf",
);

GlobalFonts.registerFromPath(fontPath, "sans-serif");

/**
 * Render ECharts chart, return Buffer or string
 * This is a pure function that doesn't handle storage logic
 */
export async function renderECharts(
  echartsOption: EChartsOption,
  width = 800,
  height = 600,
  theme = "default",
  outputType: "png" | "svg" | "option" = "png",
): Promise<Buffer | string> {
  if (outputType === "svg" || outputType === "option") {
    const chart = echarts.init(null, theme, {
      renderer: "svg",
      ssr: true,
      width,
      height,
    });

    chart.setOption({
      ...echartsOption,
      animation: false,
    });

    // Output string
    const svgStr = chart.renderToSVGString();

    // If the chart is no longer needed, call dispose to free memory
    chart.dispose();
    // Return SVG string or validated ECharts configuration options
    return outputType === "svg"
      ? svgStr
      : JSON.stringify(echartsOption, null, 2);
  }

  // Other output types (such as PNG) need to use Canvas
  const canvas = createCanvas(width, height) as unknown as HTMLCanvasElement;
  const chart = echarts.init(canvas, theme, {
    devicePixelRatio: 3,
  });

  echarts.setPlatformAPI({
    loadImage(src, onload, onerror) {
      const img = new Image();
      img.onload = onload.bind(img);
      img.onerror = onerror.bind(img);
      img.src = src;
      return img;
    },
  });

  chart.setOption({
    ...echartsOption,
    animation: false,
  });

  // @ts-ignore
  const buffer = canvas.toBuffer("image/png");

  chart.dispose();

  return buffer;
}
