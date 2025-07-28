import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { GlobalFonts, createCanvas } from "@napi-rs/canvas";
import * as echarts from "echarts";
import type { EChartsOption } from "echarts";
import { Client } from "minio";

const fontPath = path.join(
  __dirname,
  "..",
  "..",
  "fonts",
  "AlibabaPuHuiTi-3-55-Regular.otf",
);

GlobalFonts.registerFromPath(fontPath, "sans-serif");

const BUCKET_NAME = process.env.MINIO_BUCKET_NAME || "mcp-echarts";

/**
 * Check if MinIO is properly configured
 */
function isMinIOConfigured(): boolean {
  return !!(
    process.env.MINIO_ACCESS_KEY &&
    process.env.MINIO_SECRET_KEY &&
    process.env.MINIO_ENDPOINT
  );
}

/**
 * Get MinIO client (only create when properly configured)
 */
function getMinIOClient(): Client | null {
  if (!isMinIOConfigured()) {
    return null;
  }

  const endpoint = process.env.MINIO_ENDPOINT;
  const accessKey = process.env.MINIO_ACCESS_KEY;
  const secretKey = process.env.MINIO_SECRET_KEY;

  if (!endpoint || !accessKey || !secretKey) {
    return null;
  }

  return new Client({
    endPoint: endpoint,
    port: Number.parseInt(process.env.MINIO_PORT || "9000"),
    useSSL: process.env.MINIO_USE_SSL === "true",
    accessKey: accessKey,
    secretKey: secretKey,
  });
}

/**
 * Store buffer to MinIO and return the public URL
 */
async function storeBufferToMinIO(
  buffer: Buffer,
  extension: string,
  mimeType: string,
): Promise<string> {
  const minioClient = getMinIOClient();
  if (!minioClient) {
    throw new Error("MinIO client not configured");
  }

  // Generate unique filename
  const timestamp = Date.now();
  const objectName = `charts/${timestamp}.${extension}`;

  // Create temporary file
  const tempFilePath = path.join(os.tmpdir(), `temp_${timestamp}.${extension}`);
  fs.writeFileSync(tempFilePath, buffer);

  try {
    // Ensure bucket exists
    const bucketExists = await minioClient.bucketExists(BUCKET_NAME);
    if (!bucketExists) {
      await minioClient.makeBucket(BUCKET_NAME, "us-east-1");
    }

    // Upload file to MinIO
    await minioClient.fPutObject(BUCKET_NAME, objectName, tempFilePath, {
      "Content-Type": mimeType,
    });

    // Clean up temp file
    fs.unlinkSync(tempFilePath);

    // Generate public URL using environment variables
    const useSSL = process.env.MINIO_USE_SSL === "true";
    const protocol = useSSL ? "https" : "http";
    const endPoint = process.env.MINIO_ENDPOINT || "localhost";
    const port = process.env.MINIO_PORT || "9000";
    const url = `${protocol}://${endPoint}:${port}/${BUCKET_NAME}/${objectName}`;

    return url;
  } catch (error) {
    // Clean up temp file on error
    try {
      fs.unlinkSync(tempFilePath);
    } catch {
      // Ignore cleanup errors
    }
    throw error;
  }
}

export async function renderECharts(
  echartsOption: EChartsOption,
  width = 800,
  height = 600,
  theme = "default",
  outputType: "png" | "svg" | "option" = "png",
): Promise<string> {
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

    // 输出字符串
    const svgStr = chart.renderToSVGString();

    // 如果不再需要图表，调用 dispose 以释放内存
    chart.dispose();
    // 返回 SVG 字符串 或者进过运行校验的 ECharts 配置项
    return outputType === "svg"
      ? svgStr
      : JSON.stringify(echartsOption, null, 2);
  }

  // 其他输出类型（如 PNG）需要使用 Canvas
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

  if (isMinIOConfigured()) {
    return storeBufferToMinIO(buffer, "png", "image/png");
  }

  // Fallback to base64 if MinIO is not configured
  return `data:image/png;base64,${buffer.toString("base64")}`;
}
