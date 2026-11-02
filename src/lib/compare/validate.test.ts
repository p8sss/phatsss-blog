import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { validateComparison } from "./validate.ts";
import type { Comparison } from "./types.ts";

const valid: Comparison = {
  id: "a-vs-b",
  title: "A vs B",
  options: [
    { id: "a", name: "A", summary: "Tool A" },
    { id: "b", name: "B", summary: "Tool B" },
  ],
  rows: [{ criterion: "Speed", cells: { a: "Fast", b: "Slow" } }],
  verdicts: [
    { option: "a", pickWhen: ["You need speed"] },
    { option: "b", pickWhen: ["You need B things"] },
  ],
  reviewed: "2026-11-02",
  sources: [{ label: "A docs", href: "https://a.example/docs" }],
};

describe("validateComparison", () => {
  test("accepts a well-formed comparison", () => {
    assert.deepEqual(validateComparison(valid), []);
  });

  test("needs two to four options", () => {
    const one = validateComparison({ ...valid, options: [valid.options[0]] }).join();
    assert.match(one, /2 to 4 options/);
  });

  test("rejects a row missing a cell or naming an unknown option", () => {
    const rows = [{ criterion: "Speed", cells: { a: "Fast", c: "?" } }];
    const errors = validateComparison({ ...valid, rows }).join();
    assert.match(errors, /row "Speed" is missing option "b"/);
    assert.match(errors, /row "Speed" names unknown option "c"/);
  });

  test("rejects duplicate criteria", () => {
    const rows = [valid.rows[0], valid.rows[0]];
    assert.match(validateComparison({ ...valid, rows }).join(), /duplicate criterion "Speed"/);
  });

  test("needs a verdict with reasons for every option", () => {
    const verdicts = [{ option: "a", pickWhen: [] }];
    const errors = validateComparison({ ...valid, verdicts }).join();
    assert.match(errors, /option "b" has no verdict/);
    assert.match(errors, /verdict for "a" lists no reasons/);
  });

  test("needs a real review date and https sources", () => {
    const errors = validateComparison({
      ...valid,
      reviewed: "2026-13-40",
      sources: [{ label: "x", href: "http://insecure.example" }],
    }).join();
    assert.match(errors, /reviewed must be a YYYY-MM-DD date/);
    assert.match(errors, /source "x" must use https/);
  });

  test("needs at least one source", () => {
    assert.match(validateComparison({ ...valid, sources: [] }).join(), /at least one source/);
  });
});
