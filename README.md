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
- MinIO Integration, store charts in `MinIO` object storage and return URLs instead of Base64 data for better performance and sharing capabilities.
- Lightweight, we can install it easily with `zero dependence`.
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

Also, you can use it on [modelscope](https://www.modelscope.cn/mcp/servers/hustcc/MCP-ECharts), [glama.ai](https://glama.ai/mcp/servers/@hustcc/mcp-echarts), [smithery.ai](https://smithery.ai/server/@hustcc/mcp-echarts) or others with HTTP, SSE Protocol.


## 🗂️ MinIO Configuration (Optional)

For better performance and sharing capabilities, you can configure MinIO object storage to store chart images as URLs instead of Base64 data.

> [!NOTE]
> If MinIO is not configured or unavailable, the system automatically falls back to `Base64` data output, ensuring compatibility.

We can Integrate with `MinIO` object storage providers below.

 - [MinIO](https://min.io/): High-performance, S3-compatible object storage. Use [MinIO JavaScript Client](https://min.io/docs/minio/linux/developers/javascript/minio-javascript.html) for direct integration.
 - [Amazon S3](https://aws.amazon.com/s3/): Use [AWS SDK](https://aws.amazon.com/sdk-for-javascript/) with compatible API endpoint.
 - [Alibaba Cloud OSS](https://www.alibabacloud.com/product/object-storage-service): Use the [Alibaba Cloud SDK](https://www.alibabacloud.com/help/en/sdk) for OSS services.
 - [Google Cloud Storage](https://cloud.google.com/storage): Integrate using [Google Cloud SDK](https://cloud.google.com/sdk) or compatible API.
 - [Microsoft Azure Blob Storage](https://azure.microsoft.com/en-us/products/storage/blobs): Use [Azure SDK](https://azure.microsoft.com/en-us/downloads/) for Blob storage access.
 - [Tencent Cloud COS](https://intl.cloud.tencent.com/product/cos): Use the [Tencent Cloud SDK](https://intl.cloud.tencent.com/document/product/436/6474) for COS integration.

Also, we can setup MinIO locally for free.

1. **Install and start MinIO locally:**

   ```bash
   # Download MinIO (macOS example)
   brew install minio/stable/minio
   
   # Start MinIO server
   minio server ~/minio-data --console-address :9001
   ```

3. **Configure environment variables:**

   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env with your MinIO settings
   MINIO_ENDPOINT=localhost
   MINIO_PORT=9000
   MINIO_USE_SSL=false
   MINIO_ACCESS_KEY=minioadmin
   MINIO_SECRET_KEY=minioadmin
   MINIO_BUCKET_NAME=mcp-echarts
   ```


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


## 🧑🏻‍💻 Contributors

- [lyw405](https://github.com/lyw405): Supports `15+` charting MCP tool. [#2](https://github.com/hustcc/mcp-echarts/issues/2)
- [susuperli](https://github.com/susuperli): Use `MinIO` to save the chart image base64 and return the url. [#10](https://github.com/hustcc/mcp-echarts/issues/10)
- [BQXBQX](https://github.com/BQXBQX): Use `@napi-rs/canvas` instead node-canvas. [#3](https://github.com/hustcc/mcp-echarts/issues/3)
- [hustcc](https://github.com/hustcc): Initial the repo.


## 📄 License

MIT@[hustcc](https://github.com/hustcc).
