import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { errorSeverity, formatLatency, formatPercent, formatRate, latencySeverity } from "./format.ts";

describe("formatLatency", () => {
  test("shows milliseconds under a second and seconds above", () => {
    assert.equal(formatLatency(89.6), "90 ms");
    assert.equal(formatLatency(4800), "4.8 s");
  });
});

describe("formatPercent", () => {
  test("keeps small shares visible and rounds large ones", () => {
    assert.equal(formatPercent(0), "0%");
    assert.equal(formatPercent(0.01), "0.01%");
    assert.equal(formatPercent(4.25), "4.3%");
    assert.equal(formatPercent(21.4), "21%");
  });
});

describe("formatRate", () => {
  test("uses compact notation", () => {
    assert.equal(formatRate(40, "en"), "40");
    assert.equal(formatRate(120000, "en"), "120K");
  });
});

describe("severity", () => {
  test("grades latency and errors on fixed thresholds", () => {
    assert.deepEqual([90, 400, 2900].map(latencySeverity), ["ok", "warn", "bad"]);
    assert.deepEqual([0.03, 0.9, 12].map(errorSeverity), ["ok", "warn", "bad"]);
  });
});
