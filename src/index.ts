#!/usr/bin/env node
import process from "node:process";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { config } from "dotenv";
import { tools } from "./tools";

// Load environment variables from .env file (completely silent to avoid stdout contamination)
process.env.DOTENV_CONFIG_QUIET = "true";
config({ override: false, debug: false });

/**
 * MCP Server for ECharts.
 * This server provides tools for generating ECharts visualizations and validate ECharts configurations.
 */
class MCPServerECharts {
  /**
   * The MCP server instance.
   * This server handles requests and provides tools for ECharts-related tasks.
   */
  private readonly server: McpServer;

  constructor() {
    this.server = new McpServer({
      name: "mcp-echarts",
      version: "0.1.0",
    });

    for (const tool of tools) {
      const { name, description, inputSchema, run } = tool;
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      this.server.tool(name, description, inputSchema.shape, run as any);
    }
  }

  async runWithStdio(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }

  async shutdown(): Promise<void> {}
}

/**
 * Main entry point for the MCP ECharts server application.
 * This function initializes the server, sets up error handling, and starts the server.
 * It handles uncaught exceptions and unhandled promise rejections to ensure graceful shutdown.
 */
async function main(): Promise<void> {
  const server = new MCPServerECharts();

  process.on("uncaughtException", (error) => {
    server.shutdown().finally(() => {
      process.exit(1);
    });
  });

  process.on("unhandledRejection", (reason, promise) => {
    server.shutdown().finally(() => {
      process.exit(1);
    });
  });

  try {
    await server.runWithStdio();
  } catch (error) {
    process.exit(1);
  }
}

// Start application
main().catch((error) => {
  // Don't use console.error in MCP servers as it interferes with JSON protocol
  process.exit(1);
});
