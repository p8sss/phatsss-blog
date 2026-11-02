import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { validateFlow } from "./validate.ts";
import type { FlowDefinition } from "./types.ts";

const valid: FlowDefinition = {
  id: "demo",
  title: "Demo",
  actors: [
    { id: "c", label: "Client", kind: "client", col: 0, row: 0 },
    { id: "s", label: "Server", kind: "server", col: 1, row: 0 },
  ],
  steps: [
    { id: "req", from: "c", to: "s", title: "Ask", detail: "d", payload: "GET /" },
    { id: "work", from: "s", title: "Work", detail: "d" },
  ],
};

describe("validateFlow", () => {
  test("accepts a well-formed flow", () => {
    assert.deepEqual(validateFlow(valid), []);
  });

  test("rejects a flow with no steps", () => {
    assert.match(validateFlow({ ...valid, steps: [] }).join(), /no steps/);
  });

  test("rejects unknown actors in steps", () => {
    const errors = validateFlow({
      ...valid,
      steps: [{ id: "x", from: "c", to: "ghost", title: "t", detail: "d" }],
    });
    assert.match(errors.join(), /unknown actor "ghost"/);
  });

  test("rejects duplicate ids and shared grid cells", () => {
    const actors = [valid.actors[0], { ...valid.actors[0] }];
    const errors = validateFlow({ ...valid, actors });
    assert.match(errors.join(), /duplicate actor id "c"/);
    assert.match(errors.join(), /share grid cell 0,0/);
  });

  test("rejects a step that travels to its own actor", () => {
    const errors = validateFlow({
      ...valid,
      steps: [{ id: "x", from: "c", to: "c", title: "t", detail: "d" }],
    });
    assert.match(errors.join(), /omit "to" for local work/);
  });

  test("rejects payloads too long to fit on the packet", () => {
    const errors = validateFlow({
      ...valid,
      steps: [{ ...valid.steps[0], payload: "x".repeat(40) }],
    });
    assert.match(errors.join(), /payload is 40 characters/);
  });

  test("rejects non-positive durations", () => {
    const errors = validateFlow({
      ...valid,
      steps: [{ ...valid.steps[0], duration: 0 }],
    });
    assert.match(errors.join(), /duration must be positive/);
  });

  test("rejects labels too long to fit in an actor box", () => {
    const actors = [{ ...valid.actors[0], label: "A very long actor name" }, valid.actors[1]];
    assert.match(validateFlow({ ...valid, actors }).join(), /label is 22 characters/);
  });

  test("rejects grid positions that are negative or fractional", () => {
    const actors = [{ ...valid.actors[0], col: -1 }, { ...valid.actors[1], row: 0.5 }];
    const errors = validateFlow({ ...valid, actors }).join();
    assert.match(errors, /actor "c" col must be a whole number/);
    assert.match(errors, /actor "s" row must be a whole number/);
  });

  test("rejects an edge that runs straight through another actor", () => {
    const actors = [
      ...valid.actors,
      { id: "d", label: "DB", kind: "database" as const, col: 2, row: 0 },
    ];
    const steps = [{ id: "skip", from: "c", to: "d", title: "t", detail: "d" }];
    assert.match(validateFlow({ ...valid, actors, steps }).join(), /step "skip" passes through actor "s"/);
  });

  test("accepts edges between neighbours, including diagonals", () => {
    const actors = [
      ...valid.actors,
      { id: "d", label: "DB", kind: "database" as const, col: 1, row: 1 },
    ];
    const steps = [{ id: "diag", from: "c", to: "d", title: "t", detail: "d" }];
    assert.deepEqual(validateFlow({ ...valid, actors, steps }), []);
  });

  test("rejects grids taller than two rows or wider than four columns", () => {
    const actors = [
      { ...valid.actors[0], row: 2 },
      { ...valid.actors[1], col: 4 },
    ];
    const errors = validateFlow({ ...valid, actors }).join();
    assert.match(errors, /actor "c" row 2 is past the last row/);
    assert.match(errors, /actor "s" col 4 is past the last column/);
  });
});
