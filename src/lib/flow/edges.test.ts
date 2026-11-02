import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { edgeKey, latestStepOnEdge, travelEdges } from "./edges.ts";
import type { FlowStep } from "./types.ts";

const steps: readonly FlowStep[] = [
  { id: "1", from: "c", to: "s", title: "", detail: "" },
  { id: "2", from: "s", title: "", detail: "" },
  { id: "3", from: "s", to: "c", title: "", detail: "", variant: "response" },
  { id: "4", from: "c", to: "s", title: "", detail: "" },
];

describe("travelEdges", () => {
  test("lists each directed edge once, in first-use order, skipping local steps", () => {
    assert.deepEqual(
      travelEdges(steps).map((e) => e.key),
      [edgeKey("c", "s"), edgeKey("s", "c")],
    );
  });

  test("an edge takes the variant of its first step", () => {
    assert.equal(travelEdges(steps)[1].variant, "response");
    assert.equal(travelEdges(steps)[0].variant, "request");
  });
});

describe("latestStepOnEdge", () => {
  const key = edgeKey("c", "s");

  test("returns the most recent step on the edge up to an index", () => {
    assert.equal(latestStepOnEdge(steps, key, 0), 0);
    assert.equal(latestStepOnEdge(steps, key, 2), 0);
    assert.equal(latestStepOnEdge(steps, key, 3), 3);
  });

  test("returns null before the edge is first used", () => {
    assert.equal(latestStepOnEdge(steps, edgeKey("s", "c"), 1), null);
  });
});
