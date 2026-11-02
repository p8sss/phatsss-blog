import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { join } from "node:path";
import { validateComparison } from "../../../lib/compare/validate.ts";
import type { Comparison } from "../../../lib/compare/types.ts";

const dir = fileURLToPath(new URL(".", import.meta.url));
const files = readdirSync(dir).filter((f) => f.endsWith(".ts") && !f.endsWith(".test.ts"));

function isComparison(value: unknown): value is Comparison {
  return typeof value === "object" && value !== null && "rows" in value && "verdicts" in value;
}

test("the comparisons folder has at least one comparison", () => {
  assert.ok(files.length > 0);
});

for (const file of files) {
  test(`every comparison in ${file} is valid`, async () => {
    const mod: Record<string, unknown> = await import(pathToFileURL(join(dir, file)).href);
    const found = Object.values(mod).filter(isComparison);
    assert.ok(found.length > 0, `${file} exports no comparison`);
    for (const comparison of found) {
      assert.deepEqual(validateComparison(comparison), [], `${comparison.id} is invalid`);
    }
  });
}
