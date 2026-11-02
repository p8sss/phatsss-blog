import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { join } from "node:path";
import { validateFlow } from "../../../lib/flow/validate.ts";
import type { FlowDefinition } from "../../../lib/flow/types.ts";

const dir = fileURLToPath(new URL(".", import.meta.url));
const files = readdirSync(dir).filter((f) => f.endsWith(".ts") && !f.endsWith(".test.ts"));

function isFlow(value: unknown): value is FlowDefinition {
  return typeof value === "object" && value !== null && "steps" in value && "actors" in value;
}

test("the flows folder has at least one flow", () => {
  assert.ok(files.length > 0);
});

for (const file of files) {
  test(`every flow in ${file} is valid`, async () => {
    const mod: Record<string, unknown> = await import(pathToFileURL(join(dir, file)).href);
    const flows = Object.values(mod).filter(isFlow);
    assert.ok(flows.length > 0, `${file} exports no flow`);
    for (const flow of flows) {
      assert.deepEqual(validateFlow(flow), [], `${flow.id} is invalid`);
    }
  });
}
