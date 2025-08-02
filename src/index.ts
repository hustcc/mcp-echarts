#!/usr/bin/env node
import { randomUUID } from "node:crypto";
import process from "node:process";
import { parseArgs } from "node:util";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import { config } from "dotenv";
import express from "express";
import { tools } from "./tools";

// Load environment variables from .env file (completely silent to avoid stdout contamination)
process.env.DOTENV_CONFIG_QUIET = "true";
config({ override: false, debug: false });

/**
 * MCP Server for ECharts.
 * This server provides tools for generating ECharts visualizations and validate ECharts configurations.
 */
function createEChartsServer(): McpServer {
  const server = new McpServer({
    name: "mcp-echarts",
    version: "0.1.0",
  });

  for (const tool of tools) {
    const { name, description, inputSchema, run } = tool;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    server.tool(name, description, inputSchema.shape, run as any);
  }

  return server;
}

// Parse command line arguments
const { values } = parseArgs({
  options: {
    transport: {
      type: "string",
      short: "t",
      default: "stdio",
    },
    port: {
      type: "string",
      short: "p",
      default: "3033",
    },
    endpoint: {
      type: "string",
      short: "e",
      default: "", // We'll handle defaults per transport type
    },
    help: {
      type: "boolean",
      short: "h",
    },
  },
});

// Display help information if requested
if (values.help) {
  console.log(`
MCP ECharts CLI

Options:
  --transport, -t  Specify the transport protocol: "stdio", "sse", or "streamable" (default: "stdio")
  --port, -p       Specify the port for SSE or streamable transport (default: 3033)
  --endpoint, -e   Specify the endpoint for the transport:
                   - For SSE: default is "/sse"
                   - For streamable: default is "/mcp"
  --help, -h       Show this help message
  `);
  process.exit(0);
}

// Main function to start the server
async function main(): Promise<void> {
  const transport = values.transport?.toLowerCase() || "stdio";
  const port = Number.parseInt(values.port as string, 10);

  if (transport === "sse") {
    const endpoint = values.endpoint || "/sse";
    await runSSEServer(port, endpoint);
  } else if (transport === "streamable") {
    const endpoint = values.endpoint || "/mcp";
    await runStreamableHTTPServer(port, endpoint);
  } else {
    await runStdioServer();
  }
}

async function runStdioServer(): Promise<void> {
  const server = createEChartsServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

async function runSSEServer(port: number, endpoint: string): Promise<void> {
  const app = express();
  app.use(express.json());

  // Store transports by session ID
  const transports: Record<string, SSEServerTransport> = {};

  // SSE endpoint
  app.get(endpoint, async (req, res) => {
    const server = createEChartsServer();
    const transport = new SSEServerTransport("/messages", res);
    transports[transport.sessionId] = transport;

    res.on("close", () => {
      delete transports[transport.sessionId];
    });

    await server.connect(transport);
  });

  // Message endpoint for SSE
  app.post("/messages", async (req, res) => {
    const sessionId = req.query.sessionId as string;
    const transport = transports[sessionId];
    if (transport) {
      await transport.handlePostMessage(req, res, req.body);
    } else {
      res.status(400).send("No transport found for sessionId");
    }
  });

  app.listen(port, () => {
    console.log(
      `MCP ECharts SSE server running on http://localhost:${port}${endpoint}`,
    );
  });
}

async function runStreamableHTTPServer(
  port: number,
  endpoint: string,
): Promise<void> {
  const app = express();
  app.use(express.json());

  // Store transports by session ID
  const transports: Record<string, StreamableHTTPServerTransport> = {};

  // Handle POST requests for client-to-server communication
  app.post(endpoint, async (req, res) => {
    const sessionId = req.headers["mcp-session-id"] as string | undefined;
    let transport: StreamableHTTPServerTransport;

    if (sessionId && transports[sessionId]) {
      // Reuse existing transport
      transport = transports[sessionId];
    } else if (!sessionId && isInitializeRequest(req.body)) {
      // New initialization request
      transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
        onsessioninitialized: (sessionId) => {
          transports[sessionId] = transport;
        },
      });

      // Clean up transport when closed
      transport.onclose = () => {
        if (transport.sessionId) {
          delete transports[transport.sessionId];
        }
      };

      const server = createEChartsServer();
      await server.connect(transport);
    } else {
      // Invalid request
      res.status(400).json({
        jsonrpc: "2.0",
        error: {
          code: -32000,
          message: "Bad Request: No valid session ID provided",
        },
        id: null,
      });
      return;
    }

    // Handle the request
    await transport.handleRequest(req, res, req.body);
  });

  // Handle GET requests for server-to-client notifications via SSE
  app.get(endpoint, async (req, res) => {
    const sessionId = req.headers["mcp-session-id"] as string | undefined;
    if (!sessionId || !transports[sessionId]) {
      res.status(400).send("Invalid or missing session ID");
      return;
    }

    const transport = transports[sessionId];
    await transport.handleRequest(req, res);
  });

  // Handle DELETE requests for session termination
  app.delete(endpoint, async (req, res) => {
    const sessionId = req.headers["mcp-session-id"] as string | undefined;
    if (!sessionId || !transports[sessionId]) {
      res.status(400).send("Invalid or missing session ID");
      return;
    }

    const transport = transports[sessionId];
    await transport.handleRequest(req, res);
  });

  app.listen(port, () => {
    console.log(
      `MCP ECharts Streamable HTTP server running on http://localhost:${port}${endpoint}`,
    );
  });
}

// Error handling for uncaught exceptions and unhandled rejections
process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled rejection at:", promise, "reason:", reason);
  process.exit(1);
});

// Start application
main().catch((error) => {
  process.exit(1);
});
