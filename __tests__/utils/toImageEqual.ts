import * as fs from "node:fs";
import * as path from "node:path";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

export type toImageEqualOptions = {
  maxError?: number;
};

// Helper function to extract buffer from MCP tool response
function extractImageBuffer(response: unknown): Buffer {
  if (Buffer.isBuffer(response)) {
    return response;
  }

  // Handle MCP tool response format with content array
  if (response && typeof response === "object" && "content" in response) {
    const content = (response as { content: unknown[] }).content;
    if (Array.isArray(content) && content.length > 0) {
      const item = content[0];
      if (
        item &&
        typeof item === "object" &&
        "type" in item &&
        "data" in item
      ) {
        const contentItem = item as { type: string; data: string };
        if (contentItem.type === "image" && contentItem.data) {
          return Buffer.from(contentItem.data, "base64");
        }
      }
    }
  }

  // Handle MCP content response format (direct array)
  if (Array.isArray(response) && response.length > 0) {
    const content = response[0];
    if (
      content &&
      typeof content === "object" &&
      "type" in content &&
      "data" in content
    ) {
      const contentItem = content as { type: string; data: string };
      if (contentItem.type === "image" && contentItem.data) {
        return Buffer.from(contentItem.data, "base64");
      }
    }
  }

  // Handle direct object response
  if (
    response &&
    typeof response === "object" &&
    "type" in response &&
    "data" in response
  ) {
    const contentItem = response as { type: string; data: string };
    if (contentItem.type === "image" && contentItem.data) {
      return Buffer.from(contentItem.data, "base64");
    }
  }

  throw new Error("Unable to extract image buffer from response");
}

/**
// Diff between PNGs
 */
function diff(
  src: string,
  target: string,
  diff: string,
  maxError = 0,
  showMismatchedPixels = true,
) {
  let pass = true;

  const img1 = PNG.sync.read(fs.readFileSync(src));
  const img2 = PNG.sync.read(fs.readFileSync(target));
  const { width, height } = img1;

  let diffPNG: PNG | null = null;
  let output: Buffer | null = null;
  if (showMismatchedPixels) {
    diffPNG = new PNG({ width, height });
    output = diffPNG.data;
  }

  // Reference: https://github.com/mapbox/pixelmatch#pixelmatchimg1-img2-output-width-height-options
  const mismatch = pixelmatch(img1.data, img2.data, output, width, height, {
    threshold: 0.2,
  });

  if (mismatch / (width * height) > maxError) {
    pass = false;
  }

  if (showMismatchedPixels && !pass && diffPNG) {
    fs.writeFileSync(diff, PNG.sync.write(diffPNG));
  }

  return {
    pass,
    mismatch,
  };
}

// Reference: https://jestjs.io/docs/26.x/expect#expectextendmatchers
export async function toImageEqual(
  response: unknown,
  dir: string,
  name: string,
  options: toImageEqualOptions = {},
): Promise<{ message: () => string; pass: boolean }> {
  const { maxError = 0.05 } = options;

  // Extract buffer from MCP response
  const buffer = extractImageBuffer(response);

  const targetFile = path.join(dir, name);
  const actualFilePath = path.join(dir, `${name}-actual.png`);
  const expectedFilePath = path.join(dir, `${name}.png`);
  const diffFilePath = path.join(dir, `${name}-diff.png`);
  try {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    if (!fs.existsSync(expectedFilePath)) {
      if (process.env.CI === "true") {
        throw new Error(`Please generate golden image for ${targetFile}`);
      }
      console.warn(`! generate ${targetFile}`);
      fs.writeFileSync(expectedFilePath, buffer);
      return {
        message: () => `generate ${targetFile}`,
        pass: true,
      };
    }
    fs.writeFileSync(actualFilePath, buffer);
    const { mismatch, pass } = diff(
      actualFilePath,
      expectedFilePath,
      diffFilePath,
      maxError,
    );
    if (pass) {
      if (fs.existsSync(diffFilePath)) fs.unlinkSync(diffFilePath);
      fs.unlinkSync(actualFilePath);
      return {
        message: () => `match ${targetFile}`,
        pass: true,
      };
    }
    return {
      message: () => `mismatch ${targetFile} (mismatch: ${mismatch}) `,
      pass: false,
    };
  } catch (e) {
    return {
      message: () => `${e}`,
      pass: false,
    };
  }
}
