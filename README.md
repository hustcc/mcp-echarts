# <img src="https://echarts.apache.org/zh/images/favicon.png" height="24"/> MCP ECharts ![](https://badge.mcpx.dev?type=server 'MCP Server')  [![build](https://github.com/hustcc/mcp-echarts/actions/workflows/build.yml/badge.svg)](https://github.com/hustcc/mcp-echarts/actions/workflows/build.yml) [![npm Version](https://img.shields.io/npm/v/mcp-echarts.svg)](https://www.npmjs.com/package/mcp-echarts) [![smithery badge](https://smithery.ai/badge/@hustcc/mcp-echarts)](https://smithery.ai/server/@hustcc/mcp-echarts) [![npm License](https://img.shields.io/npm/l/mcp-echarts.svg)](https://www.npmjs.com/package/mcp-echarts)

Generate <img src="https://echarts.apache.org/zh/images/favicon.png" height="14"/> [Apache ECharts](https://echarts.apache.org/) diagram and chart with AI MCP dynamically. Using for chart generation and data analysis.

<a href="https://glama.ai/mcp/servers/@hustcc/mcp-echarts">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@hustcc/mcp-echarts/badge" alt="ECharts MCP server" />
</a>

<div align="center">
  <img width="648" alt="mcp-echarts" src="https://mdn.alipayobjects.com/huamei_1gdzij/afts/img/A*s3w3SpMMPDQAAAAARzAAAAgAemB7AQ/original" />
</div>

## ✨ Features

- Fully support all features and syntax of `ECharts`, include data, style, theme and so on.
- Support exporting to `png`, `svg`, and `option` formats, with validation for `ECharts` to facilitate the model's multi-round output of correct syntax and graphics.
- Lightweight, we can install it with `zero dependence`.
- Extremely `secure`, fully generated locally, without relying on any remote services.


## 🤖 Usage

To use with `Desktop APP`, such as Claude, VSCode, Cline, Cherry Studio, and so on, add the  MCP server config below. On Mac system:

```json
{
  "mcpServers": {
    "mcp-echarts": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-echarts"
      ]
    }
  }
}
```

On Window system:

```json
{
  "mcpServers": {
    "mcp-echarts": {
      "command": "cmd",
      "args": [
        "/c",
        "npx",
        "-y",
        "mcp-echarts"
      ]
    }
  }
}
```

Also, you can use it on aliyun, modelscope, glama.ai, smithery.ai or others with HTTP, SSE Protocol.


## 🔨 Development

Install dependencies:

```bash
npm install
```

Build the server:

```bash
npm run build
```

Start the MCP server:

```bash
npm run start
```


## 📄 License

MIT@[hustcc](https://github.com/hustcc).