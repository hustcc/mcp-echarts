import { generateBarChartTool } from "./bar";
import { generateBoxplotChartTool } from "./boxplot";
import { generateCandlestickChartTool } from "./candlestick";
import { generateEChartsTool } from "./echarts";
import { generateFunnelChartTool } from "./funnel";
import { generateGaugeChartTool } from "./gauge";
import { generateGraphChartTool } from "./graph";
import { generateHeatmapChartTool } from "./heatmap";
import { generateLineChartTool } from "./line";
import { generateParallelChartTool } from "./parallel";
import { generatePieChartTool } from "./pie";
import { generateRadarChartTool } from "./radar";
import { generateSankeyChartTool } from "./sankey";
import { generateScatterChartTool } from "./scatter";
import { generateSunburstChartTool } from "./sunburst";
import { generateTreeChartTool } from "./tree";
import { generateTreemapChartTool } from "./treemap";

export const tools = [
  generateEChartsTool,
  generateLineChartTool,
  generateBarChartTool,
  generatePieChartTool,
  generateRadarChartTool,
  generateScatterChartTool,
  generateSankeyChartTool,
  generateFunnelChartTool,
  generateGaugeChartTool,
  generateTreemapChartTool,
  generateSunburstChartTool,
  generateHeatmapChartTool,
  generateCandlestickChartTool,
  generateBoxplotChartTool,
  generateGraphChartTool,
  generateParallelChartTool,
  generateTreeChartTool,
];

// Re-export individual tools for convenient use in tests and other places
export {
  generateEChartsTool,
  generateLineChartTool,
  generateBarChartTool,
  generatePieChartTool,
  generateRadarChartTool,
  generateScatterChartTool,
  generateSankeyChartTool,
  generateFunnelChartTool,
  generateGaugeChartTool,
  generateTreemapChartTool,
  generateSunburstChartTool,
  generateHeatmapChartTool,
  generateCandlestickChartTool,
  generateBoxplotChartTool,
  generateGraphChartTool,
  generateParallelChartTool,
  generateTreeChartTool,
};
