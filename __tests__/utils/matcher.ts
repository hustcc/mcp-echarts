import path from "node:path";
import { expect } from "vitest";
import { toImageEqual } from "./toImageEqual";
import type { toImageEqualOptions } from "./toImageEqual";

// Extend expect type
declare module "vitest" {
  interface Assertion<T = unknown> {
    toImageEqual(name: string, options?: toImageEqualOptions): Promise<void>;
  }
}

// Add custom matcher with default output directory
expect.extend({
  async toImageEqual(
    received: unknown,
    name: string,
    options: toImageEqualOptions = {},
  ) {
    const result = await toImageEqual(
      received,
      path.join(__dirname, "../snapshots"),
      name,
      options,
    );
    return {
      pass: result.pass,
      message: result.message,
    };
  },
});
