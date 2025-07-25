import { generateEChartsTool } from "./echarts";
import { generateLineChartTool } from "./line";

export const tools = [generateEChartsTool, generateLineChartTool];

// 重新导出各个工具，方便测试和其他地方使用
export { generateEChartsTool, generateLineChartTool };
